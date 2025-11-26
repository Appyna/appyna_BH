import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Conversation, Message as MessageType } from '../types';
import { BackButton } from '../components/BackButton';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../contexts/AuthContext';
import { messagesService } from '../lib/messagesService';
import { supabase } from '../lib/supabaseClient';

// Formater la date pour la liste des conversations
const formatConversationDate = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    // Aujourd'hui : seulement l'heure
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else {
    // Autre jour : date + heure
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

// Formater la date pour les messages (juste l'heure)
const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// Vérifier si on doit afficher un séparateur de date
const shouldShowDateSeparator = (currentMsg: Date, previousMsg?: Date) => {
  if (!previousMsg) return true;
  
  const currentDate = new Date(currentMsg.getFullYear(), currentMsg.getMonth(), currentMsg.getDate());
  const prevDate = new Date(previousMsg.getFullYear(), previousMsg.getMonth(), previousMsg.getDate());
  
  return currentDate.getTime() !== prevDate.getTime();
};

// Formater le séparateur de date
const formatDateSeparator = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (messageDate.getTime() === today.getTime()) {
    return "Aujourd'hui";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Hier";
  } else {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
};

interface ConversationWithData extends Conversation {
  otherUser?: { id: string; name: string; avatarUrl?: string };
  listing?: { id: string; title: string };
}

// Helper pour enrichir les conversations avec les données utilisateur et annonce
async function enrichConversations(conversations: Conversation[], currentUserId: string): Promise<ConversationWithData[]> {
  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const otherUserId = conv.participantIds.find(id => id !== currentUserId);
      
      // Récupérer les données de l'autre utilisateur
      let otherUser: { id: string; name: string; avatarUrl?: string } | undefined;
      if (otherUserId) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, name, avatar_url, email')
            .eq('id', otherUserId)
            .single();
          
          if (!error && data) {
            // Si c'est le compte admin, afficher "Appyna®"
            const isAdmin = data.email === 'projet.lgsz@gmail.com';
            otherUser = {
              id: data.id,
              name: isAdmin ? 'Appyna®' : data.name,
              avatarUrl: data.avatar_url,
            };
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      }

      // Récupérer les données de l'annonce
      let listing: { id: string; title: string } | undefined;
      if (conv.listingId) {
        try {
          const { data, error } = await supabase
            .from('listings')
            .select('id, title, is_hidden, user_id')
            .eq('id', conv.listingId)
            .single();
          
          if (!error && data) {
            // La RLS policy bloque déjà les annonces masquées
            // Mais on vérifie quand même côté client pour afficher un message approprié
            listing = {
              id: data.id,
              title: data.is_hidden ? '[Annonce supprimée]' : data.title,
            };
          }
        } catch (err) {
          console.error('Error fetching listing:', err);
          // Si l'annonce est masquée et que l'utilisateur n'a pas le droit, mettre un placeholder
          listing = {
            id: conv.listingId,
            title: '[Annonce non disponible]'
          };
        }
      }

      return {
        ...conv,
        otherUser,
        listing,
      };
    })
  );

  return enriched;
}

const ConversationItem: React.FC<{ 
  conv: ConversationWithData, 
  isActive: boolean,
  currentUserId: string,
  getLastSeenMessageId: (convId: string) => string | null
}> = ({ conv, isActive, currentUserId, getLastSeenMessageId }) => {
  const otherUser = conv.otherUser;
  const listing = conv.listing;
  const lastMessage = conv.messages[conv.messages.length - 1];
  
  // Vérifier s'il y a des messages non lus : comparer le dernier message avec le dernier vu
  const lastSeenId = getLastSeenMessageId(conv.id);
  const hasUnreadMessages = !isActive && conv.messages.some(msg => {
    // Un message est non lu s'il est reçu (pas envoyé par moi) et après le dernier vu
    if (msg.senderId === currentUserId) return false;
    if (!lastSeenId) return true; // Jamais ouvert = non lu
    // Trouver l'index du dernier message vu
    const lastSeenIndex = conv.messages.findIndex(m => m.id === lastSeenId);
    const currentIndex = conv.messages.findIndex(m => m.id === msg.id);
    return currentIndex > lastSeenIndex;
  });

  // Ne pas afficher les conversations sans messages
  if (!otherUser || !lastMessage) return null;

  return (
    <Link
      to={`/messages/${conv.id}`}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
      }`}
    >
      {otherUser.avatarUrl ? (
        <img src={otherUser.avatarUrl} alt={otherUser.name} className="h-12 w-12 rounded-full object-cover mr-3" />
      ) : (
        <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-center">
          <p className={`font-bold text-gray-800 truncate ${hasUnreadMessages ? 'text-primary-600' : ''}`}>
            {otherUser.name}
          </p>
          <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {formatConversationDate(lastMessage.createdAt)}
          </p>
        </div>
        {listing && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 truncate">{listing.title}</p>
            {/* Badge de nouveau message - aligné à droite */}
            {hasUnreadMessages && (
              <div className="w-2 h-2 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full flex-shrink-0 ml-auto"></div>
            )}
          </div>
        )}
        <p className={`text-sm truncate ${hasUnreadMessages ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>
          {lastMessage.text}
        </p>
      </div>
    </Link>
  );
};

const ChatWindow: React.FC<{ 
  conversation: ConversationWithData; 
  onDelete: (convId: string) => void;
  onSendMessage: (convId: string, text: string) => Promise<void>;
  onMessageReceived: (convId: string, message: MessageType) => void;
  onMarkAsRead: (convId: string) => void;
  currentUserId: string;
  initialListingId?: string;
}> = ({ conversation, onDelete, onSendMessage, onMessageReceived, onMarkAsRead, currentUserId, initialListingId }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const otherUser = conversation.otherUser;
    const listing = conversation.listing;

    if (!otherUser) return <div className="flex items-center justify-center h-full text-gray-500">Erreur de conversation.</div>;

    // S'abonner aux nouveaux messages en temps réel pour cette conversation
    useEffect(() => {
        const unsubscribe = messagesService.subscribeToConversation(
            conversation.id,
            (message) => {
                onMessageReceived(conversation.id, message);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [conversation.id, onMessageReceived]);

    // Marquer les messages comme lus quand on ouvre la conversation
    useEffect(() => {
        onMarkAsRead(conversation.id);
    }, [conversation.id, onMarkAsRead]);

    // Scroll instantané en bas au premier chargement et à chaque changement de conversation
    useEffect(() => {
        // Petit délai pour s'assurer que le DOM est rendu
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 0);
    }, [conversation.id]);

    // Auto-scroll vers le bas quand on ajoute des messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages.length]);

    // Auto-resize du textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // Max 150px
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [newMessage]);

    const handleSend = async () => {
        const messageToSend = newMessage.trim();
        if(messageToSend && !isSending){
            // Vider immédiatement le champ
            setNewMessage('');
            setIsSending(true);
            
            try {
                await onSendMessage(conversation.id, messageToSend);
            } catch (error: any) {
                console.error('Error sending message:', error);
                
                // Afficher le message d'erreur approprié
                if (error.message?.includes('5000')) {
                    alert('📝 Votre message est trop long (maximum 5000 caractères).');
                } else if (error.message?.includes('vide')) {
                    alert('✍️ Votre message ne peut pas être vide.');
                } else {
                    alert('❌ Erreur lors de l\'envoi du message. Veuillez réessayer.');
                }
                
                // Remettre le message en cas d'erreur
                setNewMessage(messageToSend);
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleDeleteConversation = () => {
        onDelete(conversation.id);
        setShowDeleteModal(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
                {/* Bouton retour mobile */}
                <Link
                    to="/messages"
                    className="md:hidden mr-3 text-gray-600 hover:text-primary-600 transition-colors"
                    aria-label="Retour à la messagerie"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex items-center min-w-0 flex-1">
                    {otherUser.avatarUrl ? (
                      <img src={otherUser.avatarUrl} alt={otherUser.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <Link 
                            to={`/profile/${otherUser.id}`} 
                            className="font-bold text-gray-800 hover:text-primary-600 transition-colors block overflow-hidden text-ellipsis whitespace-nowrap"
                            title={otherUser.name}
                        >
                            {otherUser.name}
                        </Link>
                        {listing && (
                            <Link 
                              to={`/listing/${listing.id}`} 
                              className="block text-sm text-primary-600 hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
                              title={listing.title}
                            >
                                {listing.title}
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Boutons actions (signalement et suppression) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2"
                        title="Signaler cette personne"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-gray-600 hover:text-red-600 transition-colors p-2"
                        title="Supprimer cette discussion"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto max-h-[50vh] md:max-h-none">
                <div className="space-y-4">
                    {conversation.messages.map((message, index) => {
                        const previousMessage = index > 0 ? conversation.messages[index - 1] : undefined;
                        const showDateSeparator = shouldShowDateSeparator(message.createdAt, previousMessage?.createdAt);
                        
                        return (
                            <React.Fragment key={message.id}>
                                {/* Séparateur de date */}
                                {showDateSeparator && (
                                    <div className="flex justify-center my-4">
                                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                            {formatDateSeparator(message.createdAt)}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Message */}
                                <div className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex flex-col">
                                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                            message.senderId === currentUserId 
                                                ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white' 
                                                : 'bg-gray-200 text-gray-800'
                                        }`}>
                                            <p className="break-words">{message.text}</p>
                                        </div>
                                        <span className={`text-xs text-gray-400 mt-1 ${
                                            message.senderId === currentUserId ? 'text-right' : 'text-left'
                                        }`}>
                                            {formatMessageTime(message.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 p-4 border-t bg-gray-50">
                <div className="flex items-end space-x-2">
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Écrivez votre message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-primary-500 focus:border-primary-500 resize-none overflow-y-auto"
                        rows={1}
                        style={{ minHeight: '40px', maxHeight: '150px' }}
                    />
                    <button 
                        onClick={handleSend} 
                        className="bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white p-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex-shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal de signalement */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                type="user"
                targetId={otherUser.id}
            />

            {/* Modal de confirmation de suppression */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins text-center mb-3">
                            Supprimer cette discussion
                        </h3>
                        <p className="text-gray-600 text-center mb-6 font-montserrat">
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 px-5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteConversation}
                                className="flex-1 py-2.5 px-5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [, forceUpdate] = useState(0); // Pour forcer re-render du point bleu
  const hasProcessedState = useRef(false);
  
  // Récupérer les données passées depuis "Contacter"
  const locationState = location.state as { recipientId?: string; listingId?: string } | null;
  
  // Helper: Récupérer le dernier message vu pour une conversation depuis localStorage
  const getLastSeenMessageId = (convId: string): string | null => {
    return localStorage.getItem(`lastSeen_${convId}`);
  };
  
  // Helper: Sauvegarder le dernier message vu pour une conversation
  const setLastSeenMessageId = (convId: string, messageId: string) => {
    localStorage.setItem(`lastSeen_${convId}`, messageId);
  };

  // Synchro localStorage entre onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('lastSeen_')) {
        // Un autre onglet a marqué une conversation comme lue
        forceUpdate(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [forceUpdate]);

  // Charger les conversations de l'utilisateur (initial)
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadConversations = async () => {
      try {
        const data = await messagesService.getConversations(user.id, 0);
        const enriched = await enrichConversations(data, user.id);
        setConversations(enriched);
        setOffset(50);
        // Si moins de 50 conversations, c'est qu'il n'y en a plus
        setHasMore(data.length >= 50);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // S'abonner aux mises à jour en temps réel
    const unsubscribe = messagesService.subscribeToUserConversations(user.id, () => {
      // Recharger toutes les conversations quand il y a une mise à jour
      loadConversations();
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]);
  
  // Gérer la création/recherche de conversation depuis "Contacter"
  useEffect(() => {
    if (locationState?.recipientId && locationState?.listingId && !conversationId && !hasProcessedState.current && user?.id) {
      hasProcessedState.current = true;
      
      const handleContact = async () => {
        try {
          const conv = await messagesService.getOrCreateConversation(
            locationState.listingId!,
            user.id,
            locationState.recipientId!
          );
          
          // Enrichir la conversation et l'ajouter à la liste si elle n'existe pas
          const enriched = await enrichConversations([conv], user.id);
          setConversations(prev => {
            const exists = prev.some(c => c.id === conv.id);
            if (!exists) {
              return [...enriched, ...prev];
            }
            return prev;
          });
          
          navigate(`/messages/${conv.id}`, { replace: true });
        } catch (error) {
          console.error('Error creating conversation:', error);
          alert('Erreur lors de la création de la conversation');
        }
      };

      handleContact();
    }
  }, [locationState, conversationId, user?.id, navigate]);
  
  // Chercher la conversation active
  const activeConversation = conversations.find(c => c.id === conversationId);
  
  // Récupérer l'initialListingId depuis le state de navigation
  const navState = location.state as { initialListingId?: string } | null;
  const initialListingId = navState?.initialListingId || locationState?.listingId;
  
  const handleMarkAsRead = useCallback((convId: string) => {
    const conversation = conversations.find(c => c.id === convId);
    if (!conversation || conversation.messages.length === 0) return;
    
    // Sauvegarder le dernier message comme "vu" dans localStorage
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    setLastSeenMessageId(convId, lastMessage.id);
    
    // Déclencher un événement pour notifier le badge Header
    window.dispatchEvent(new Event('messagesRead'));
    
    // Forcer un re-render léger pour mettre à jour le point bleu
    forceUpdate(prev => prev + 1);
  }, [conversations, forceUpdate]);

  const handleLoadMore = async () => {
    if (!user?.id || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const data = await messagesService.getConversations(user.id, offset);
      const enriched = await enrichConversations(data, user.id);
      
      // Ajouter les nouvelles conversations à la liste existante
      setConversations(prev => [...prev, ...enriched]);
      
      // Mettre à jour l'offset pour le prochain chargement
      setOffset(prev => prev + 50);
      
      // Si moins de 50 conversations chargées, c'est qu'il n'y en a plus
      setHasMore(data.length >= 50);
    } catch (error) {
      console.error('Error loading more conversations:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!user?.id) return;
    
    // Soft delete en base de données
    const success = await messagesService.deleteConversation(convId, user.id);
    
    if (success) {
      // Retirer localement après suppression réussie
      setConversations(conversations.filter(c => c.id !== convId));
      navigate('/messages', { replace: true });
    } else {
      alert('Erreur lors de la suppression de la conversation');
    }
  };
  
  const handleSendMessage = async (convId: string, text: string) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }
    
    // Optimistic update : ajouter le message immédiatement localement
    const tempMessage: MessageType = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      text,
      createdAt: new Date(),
    };
    
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === convId) {
          return {
            ...conv,
            messages: [...conv.messages, tempMessage],
          };
        }
        return conv;
      });
    });
    
    // Envoyer le message à Supabase (le real-time remplacera le message temp)
    await messagesService.sendMessage(convId, user.id, text);
  };

  const handleMessageReceived = (convId: string, message: MessageType) => {
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === convId) {
          // Remplacer le message temporaire ou ajouter le nouveau message
          const tempIndex = conv.messages.findIndex(m => m.id.startsWith('temp-') && m.text === message.text);
          
          if (tempIndex >= 0) {
            // Remplacer le message temporaire par le vrai
            const newMessages = [...conv.messages];
            newMessages[tempIndex] = message;
            return {
              ...conv,
              messages: newMessages,
            };
          } else {
            // Vérifier si le message n'existe pas déjà
            const messageExists = conv.messages.some(m => m.id === message.id);
            if (!messageExists) {
              return {
                ...conv,
                messages: [...conv.messages, message],
              };
            }
          }
        }
        return conv;
      }).sort((a, b) => {
        // Trier par date du dernier message
        const aTime = a.messages[a.messages.length - 1]?.createdAt || new Date(0);
        const bTime = b.messages[b.messages.length - 1]?.createdAt || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
    });
  };



  return (
    <div className="container mx-auto h-[calc(100vh-5rem)] py-4">
      <BackButton />
      <div className="flex h-full bg-white rounded-2xl shadow-lg border overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r flex flex-col ${conversationId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold font-poppins text-gray-800">Messagerie</h1>
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : conversations.length > 0 && user ? (
              <>
                {conversations.map(conv => (
                  <ConversationItem 
                    key={conv.id} 
                    conv={conv} 
                    isActive={conv.id === conversationId}
                    currentUserId={user.id}
                    getLastSeenMessageId={getLastSeenMessageId}
                  />
                ))}
                
                {/* Bouton "Charger plus" */}
                {hasMore && (
                  <div className="p-4 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="w-full py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-montserrat"
                    >
                      {loadingMore ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          Chargement...
                        </span>
                      ) : (
                        'Charger plus de conversations'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                {user ? 'Aucune conversation' : 'Vous devez être connecté pour voir vos messages.'}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 lg:w-3/4 ${conversationId ? 'block' : 'hidden md:block'}`}>
          {activeConversation && user ? (
            <ChatWindow 
              conversation={activeConversation} 
              onDelete={handleDeleteConversation}
              onSendMessage={handleSendMessage}
              onMessageReceived={handleMessageReceived}
              onMarkAsRead={handleMarkAsRead}
              currentUserId={user.id}
              initialListingId={initialListingId}
            />
          ) : loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p>Chargement...</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <h2 className="text-xl font-bold">Bienvenue dans votre messagerie</h2>
              <p>Sélectionnez une conversation pour commencer à discuter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};