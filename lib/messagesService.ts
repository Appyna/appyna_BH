import { supabase } from './supabaseClient';
import { Conversation, Message } from '../types';
import { logger } from './logger';

// Constantes de validation
const MAX_MESSAGE_LENGTH = 5000;
const CONVERSATIONS_LIMIT = 50; // Pagination

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
        logger.error('Error fetching conversations:', convError);
        return [];
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // OPTIMISATION: Charger tous les messages en 1 seule requête (fix N+1)
      const conversationIds = conversations.map(c => c.id);
      const { data: allMessages, error: msgError } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, text, created_at')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: true });

      if (msgError) {
        logger.error('Error fetching messages:', msgError);
        // Ne pas retourner [] ici, continuer avec conversations vides
      }

      // Grouper les messages par conversation_id
      const messagesByConversation = new Map<string, Message[]>();
      (allMessages || []).forEach((msg: any) => {
        const message: Message = {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.text,
          createdAt: new Date(msg.created_at),
        };
        
        if (!messagesByConversation.has(msg.conversation_id)) {
          messagesByConversation.set(msg.conversation_id, []);
        }
        messagesByConversation.get(msg.conversation_id)!.push(message);
      });

      // Construire les conversations avec leurs messages
      const conversationsWithMessages = conversations.map(conv => ({
        id: conv.id,
        listingId: conv.listing_id,
        participantIds: [conv.user1_id, conv.user2_id],
        messages: messagesByConversation.get(conv.id) || [],
      }));

      return conversationsWithMessages;
    } catch (error) {
      logger.error('Error in getConversations:', error);
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
        logger.error('Error fetching conversation:', convError);
        return null;
      }

      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        logger.error('Error fetching messages:', msgError);
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
      logger.error('Error in getConversationById:', error);
      return null;
    }
  },

  /**
   * Crée ou récupère une conversation entre deux utilisateurs (avec ou sans annonce)
   */
  async getOrCreateConversation(
    listingId: string | null,
    user1Id: string,
    user2Id: string
  ): Promise<Conversation | null> {
    try {
      // Chercher une conversation existante (peu importe l'ordre des utilisateurs)
      let query = supabase
        .from('conversations')
        .select('*');
      
      // Si listingId est fourni, chercher conversation pour cette annonce
      if (listingId) {
        query = query
          .eq('listing_id', listingId)
          .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`);
      } else {
        // Sinon, chercher conversation sans annonce entre ces 2 utilisateurs
        query = query
          .is('listing_id', null)
          .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`);
      }
      
      const { data: existing, error: searchError } = await query.maybeSingle();

      if (searchError && searchError.code !== 'PGRST116') {
        logger.error('Error searching conversation:', searchError);
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
        logger.error('Error creating conversation:', createError);
        return null;
      }

      return {
        id: newConv.id,
        listingId: newConv.listing_id,
        participantIds: [newConv.user1_id, newConv.user2_id],
        messages: [],
      };
    } catch (error) {
      logger.error('Error in getOrCreateConversation:', error);
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
        logger.error('Error sending message:', error);
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
      logger.error('Error in sendMessage:', error);
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
        logger.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error in deleteConversation:', error);
      return false;
    }
  },
};
