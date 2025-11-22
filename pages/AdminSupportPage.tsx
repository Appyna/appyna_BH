import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getAdminUserId, ADMIN_DISPLAY_NAME } from '../lib/adminConfig';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SupportConversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

export const AdminSupportPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Récupérer l'ID admin au chargement
  useEffect(() => {
    const fetchAdminId = async () => {
      console.log('🔍 Récupération ID admin...');
      const id = await getAdminUserId();
      console.log('✅ Admin ID récupéré:', id);
      console.log('👤 Utilisateur connecté:', user?.id, user?.email);
      setAdminId(id);
    };
    fetchAdminId();
  }, [user]);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger les conversations de support
  useEffect(() => {
    if (!adminId) return;

    const loadConversations = async () => {
      try {
        // Récupérer toutes les conversations de support où l'admin est participant
        // (conversations sans listing_id, créées via le formulaire de contact)
        console.log('🔍 Chargement conversations support pour admin:', adminId);
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .or(`user1_id.eq.${adminId},user2_id.eq.${adminId}`)
          .is('listing_id', null)
          .order('updated_at', { ascending: false });

        console.log('📊 Conversations trouvées:', convData?.length || 0, convData);
        if (convError) {
          console.error('❌ Erreur chargement conversations:', convError);
          throw convError;
        }

        if (convError) throw convError;

        // Enrichir avec les données utilisateur et dernier message
        const enrichedConvs = await Promise.all(
          (convData || []).map(async (conv) => {
            const otherUserId = conv.user1_id === adminId ? conv.user2_id : conv.user1_id;
            console.log('👤 Enrichissement conversation:', conv.id, 'User:', otherUserId);

            // Récupérer l'utilisateur
            const { data: userData } = await supabase
              .from('users')
              .select('name, avatar_url')
              .eq('id', otherUserId)
              .single();

            // Récupérer le dernier message
            const { data: lastMsg } = await supabase
              .from('messages')
              .select('text, created_at')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // Compter les messages de l'utilisateur (approximation des non lus)
            const { count: unreadCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .eq('sender_id', otherUserId);

            return {
              id: conv.id,
              userId: otherUserId,
              userName: userData?.name || 'Utilisateur inconnu',
              userAvatar: userData?.avatar_url,
              lastMessage: lastMsg?.text || 'Aucun message',
              lastMessageAt: lastMsg ? new Date(lastMsg.created_at) : new Date(conv.updated_at),
              unreadCount: unreadCount || 0,
            };
          })
        );

        console.log('✅ Conversations enrichies:', enrichedConvs.length, enrichedConvs);
        setConversations(enrichedConvs);
      } catch (error) {
        console.error('❌ Error loading support conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    // Écouter les nouveaux messages en temps réel
    const channel = supabase
      .channel('support-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        loadConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminId]);

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(
        (data || []).map((msg) => ({
          id: msg.id,
          content: msg.text,
          senderId: msg.sender_id,
          createdAt: new Date(msg.created_at),
        }))
      );
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Sélectionner une conversation
  const handleSelectConversation = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    loadMessages(conv.id);
  };

  // Envoyer un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !adminId) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: selectedConversation.id,
        sender_id: adminId,
        text: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Vérifier que l'utilisateur connecté est bien l'admin
  if (user && adminId && user.id !== adminId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Accès refusé</h2>
          <p className="text-gray-600 mb-2">
            Vous devez être connecté avec le compte admin pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500">
            Compte actuel : {user.email}
          </p>
          <p className="text-sm text-gray-500">
            Compte admin requis : projet.lgsz@gmail.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          📧 Support Client
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gérez les demandes de contact des utilisateurs
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Liste des conversations */}
        <div className="w-full md:w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="font-medium">Aucune demande de support</p>
              <p className="text-sm mt-2">Les conversations apparaîtront ici</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation?.id === conv.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                      {conv.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{conv.userName}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(conv.lastMessageAt, { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </button>
            ))
          )}
        </div>

        {/* Zone de messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-lg">
                    {selectedConversation.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedConversation.userName}</h2>
                    <p className="text-sm text-gray-500">Conversation de support</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isAdmin = msg.senderId === adminId;
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isAdmin
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isAdmin ? 'text-white/70' : 'text-gray-500'}`}>
                          {msg.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input message */}
              <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Répondre à l'utilisateur..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg hover:from-primary-700 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm mt-2">Choisissez une demande de support dans la liste</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
