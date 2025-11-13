import { supabase } from './supabaseClient';
import { Conversation, Message } from '../types';

// Constantes de validation
const MAX_MESSAGE_LENGTH = 5000;
const CONVERSATIONS_LIMIT = 50; // Pagination

// Rate limiting simple (côté client)
const messageTimestamps: number[] = [];
const MAX_MESSAGES_PER_MINUTE = 30;

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Retirer les timestamps > 1 minute
  while (messageTimestamps.length > 0 && messageTimestamps[0] < oneMinuteAgo) {
    messageTimestamps.shift();
  }
  
  if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
    return false;
  }
  
  messageTimestamps.push(now);
  return true;
}

export const messagesService = {
  /**
   * Récupère les conversations récentes d'un utilisateur (avec pagination)
   * @param userId - ID de l'utilisateur
   * @param offset - Nombre de conversations à sauter (pour pagination)
   */
  async getConversations(userId: string, offset: number = 0): Promise<Conversation[]> {
    try {
      // Récupérer les conversations où l'utilisateur est participant (AVEC PAGINATION)
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          listing_id,
          user1_id,
          user2_id,
          created_at,
          updated_at
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('updated_at', { ascending: false })
        .range(offset, offset + CONVERSATIONS_LIMIT - 1);

      if (convError) {
        console.error('Error fetching conversations:', convError);
        return [];
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // Pour chaque conversation, récupérer les messages
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
          const { data: messages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          if (msgError) {
            console.error('Error fetching messages:', msgError);
            return null;
          }

          const mappedMessages = (messages || []).map((msg: any): Message => ({
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.text,
            createdAt: new Date(msg.created_at),
          }));

          return {
            id: conv.id,
            listingId: conv.listing_id,
            participantIds: [conv.user1_id, conv.user2_id],
            messages: mappedMessages,
          };
        })
      );

      return conversationsWithMessages.filter((c): c is Conversation => c !== null);
    } catch (error) {
      console.error('Error in getConversations:', error);
      return [];
    }
  },

  /**
   * Récupère une conversation spécifique par ID
   */
  async getConversationById(conversationId: string): Promise<Conversation | null> {
    try {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError || !conv) {
        console.error('Error fetching conversation:', convError);
        return null;
      }

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        return null;
      }

      return {
        id: conv.id,
        listingId: conv.listing_id,
        participantIds: [conv.user1_id, conv.user2_id],
        messages: (messages || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
        })),
      };
    } catch (error) {
      console.error('Error in getConversationById:', error);
      return null;
    }
  },

  /**
   * Crée ou récupère une conversation entre deux utilisateurs pour une annonce
   */
  async getOrCreateConversation(
    listingId: string,
    user1Id: string,
    user2Id: string
  ): Promise<Conversation | null> {
    try {
      // Chercher une conversation existante (peu importe l'ordre des utilisateurs)
      const { data: existing, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('listing_id', listingId)
        .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
        .maybeSingle();

      if (searchError && searchError.code !== 'PGRST116') {
        console.error('Error searching conversation:', searchError);
        return null;
      }

      if (existing) {
        // Conversation existante, récupérer les messages
        return await messagesService.getConversationById(existing.id);
      }

      // Créer une nouvelle conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert([
          {
            listing_id: listingId,
            user1_id: user1Id,
            user2_id: user2Id,
          },
        ])
        .select()
        .single();

      if (createError || !newConv) {
        console.error('Error creating conversation:', createError);
        return null;
      }

      return {
        id: newConv.id,
        listingId: newConv.listing_id,
        participantIds: [newConv.user1_id, newConv.user2_id],
        messages: [],
      };
    } catch (error) {
      console.error('Error in getOrCreateConversation:', error);
      return null;
    }
  },

  /**
   * Envoie un message dans une conversation avec validation et rate limiting
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    text: string
  ): Promise<Message | null> {
    try {
      // Validation de la longueur
      if (!text || text.trim().length === 0) {
        throw new Error('Le message ne peut pas être vide');
      }
      
      if (text.length > MAX_MESSAGE_LENGTH) {
        throw new Error(`Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`);
      }
      
      // Rate limiting côté client
      if (!checkRateLimit()) {
        throw new Error('Vous envoyez trop de messages. Veuillez patienter.');
      }
      
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            text: text.trim(),
          },
        ])
        .select()
        .single();

      if (error || !message) {
        console.error('Error sending message:', error);
        return null;
      }

      // Mettre à jour la date de dernière activité de la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        id: message.id,
        senderId: message.sender_id,
        text: message.text,
        createdAt: new Date(message.created_at),
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  },

  /**
   * S'abonner aux nouveaux messages d'une conversation en temps réel
   */
  subscribeToConversation(
    conversationId: string,
    onNewMessage: (message: Message) => void
  ) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            text: payload.new.text,
            createdAt: new Date(payload.new.created_at),
          };
          onNewMessage(newMessage);
        }
      )
      .subscribe();

    // Retourner une fonction pour se désabonner
    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * S'abonner aux mises à jour de toutes les conversations d'un utilisateur
   */
  subscribeToUserConversations(
    userId: string,
    onUpdate: () => void
  ) {
    const channel = supabase
      .channel(`user-conversations:${userId}`)
      // Écouter les nouveaux messages
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          onUpdate();
        }
      )
      // Écouter les nouvelles conversations
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `user1_id=eq.${userId}`,
        },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `user2_id=eq.${userId}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Supprime une conversation (soft delete)
   */
  async deleteConversation(conversationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('soft_delete_conversation', {
        p_conversation_id: conversationId,
        p_user_id: userId,
      });

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      return false;
    }
  },
};
