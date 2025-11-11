import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { mockConversations, mockListings, mockUsers } from '../data/mock';
import { Conversation } from '../types';
import { BackButton } from '../components/BackButton';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../contexts/AuthContext';

// Fix: Set a mock current user ID to make the component functional for the demo.
// In a real app, this would come from an authentication context.
const currentUserId = mockUsers.length > 1 ? mockUsers[1].id : (mockUsers.length > 0 ? mockUsers[0].id : '');

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

const ConversationItem: React.FC<{ conv: Conversation, isActive: boolean }> = ({ conv, isActive }) => {
  const otherParticipantId = conv.participantIds.find(id => id !== currentUserId);
  const otherUser = mockUsers.find(u => u.id === otherParticipantId);
  const listing = mockListings.find(l => l.id === conv.listingId);
  const lastMessage = conv.messages[conv.messages.length - 1];
  
  // Mock: déterminer s'il y a des messages non lus (en production, vérifier avec une propriété unreadCount)
  const hasUnreadMessages = lastMessage && lastMessage.senderId !== currentUserId && !isActive;

  // Ne pas afficher les conversations sans messages
  if (!otherUser || !lastMessage) return null;

  return (
    <Link
      to={`/messages/${conv.id}`}
      className={`flex items-center p-3 rounded-lg transition-colors relative ${
        isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
      }`}
    >
      {/* Badge de nouveau message */}
      {hasUnreadMessages && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full"></div>
      )}
      
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
        {listing && <p className="text-sm text-gray-500 truncate">{listing.title}</p>}
        <p className={`text-sm truncate ${hasUnreadMessages ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>
          {lastMessage.text}
        </p>
      </div>
    </Link>
  );
};

const ChatWindow: React.FC<{ 
  conversation: Conversation; 
  onDelete: (convId: string) => void;
  onAddToHistory: (conv: Conversation) => Conversation;
  initialListingId?: string;
}> = ({ conversation, onDelete, onAddToHistory, initialListingId }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const otherParticipantId = conversation.participantIds.find(id => id !== currentUserId);
    const otherUser = mockUsers.find(u => u.id === otherParticipantId);
    const listing = mockListings.find(l => l.id === conversation.listingId);

    if (!otherUser) return <div className="flex items-center justify-center h-full text-gray-500">Erreur de conversation.</div>;

    // Auto-scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    // Auto-resize du textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // Max 150px
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [newMessage]);

    const handleSend = () => {
        if(newMessage.trim()){
            // Si c'est une conversation temporaire (pas encore dans l'historique), l'ajouter maintenant
            if (conversation.messages.length === 0) {
                onAddToHistory(conversation);
            }
            
            console.log("Sending message:", newMessage); // Mock sending
            // En production: ajouter le message à la conversation
            setNewMessage('');
        }
    };

    const handleDeleteConversation = () => {
        console.log("Deleting conversation:", conversation.id);
        onDelete(conversation.id);
        setShowDeleteModal(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                    {otherUser.avatarUrl ? (
                      <img src={otherUser.avatarUrl} alt={otherUser.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <div>
                        <Link 
                            to={`/profile/${otherUser.id}`} 
                            className="font-bold text-gray-800 hover:text-primary-600 transition-colors"
                        >
                            {otherUser.name}
                        </Link>
                        {listing && (
                            <Link to={`/listing/${listing.id}`} className="block text-sm text-primary-600 hover:underline">
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
            <div className="flex-grow p-4 overflow-y-auto">
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
  const [conversations, setConversations] = useState(mockConversations.filter(c => c.participantIds.includes(currentUserId!)));
  const [tempConversation, setTempConversation] = useState<Conversation | null>(null);
  const hasProcessedState = useRef(false);
  
  // Récupérer les données passées depuis "Contacter"
  const locationState = location.state as { recipientId?: string; listingId?: string } | null;
  
  // Créer ou trouver la conversation appropriée
  useEffect(() => {
    if (locationState?.recipientId && !conversationId && !hasProcessedState.current) {
      hasProcessedState.current = true;
      
      // Chercher si une conversation existe déjà avec cette personne
      const existingConv = conversations.find(c => 
        c.participantIds.includes(locationState.recipientId!)
      );
      
      if (existingConv) {
        // Conversation existe déjà, naviguer vers elle
        navigate(`/messages/${existingConv.id}`, { 
          replace: true,
          state: { initialListingId: locationState.listingId }
        });
      } else {
        // Créer une conversation temporaire (qui ne sera dans l'historique qu'après l'envoi d'un message)
        const newConv: Conversation = {
          id: `temp_${Date.now()}`,
          participantIds: [currentUserId!, locationState.recipientId],
          listingId: locationState.listingId || '',
          messages: []
        };
        setTempConversation(newConv);
        // Naviguer vers la conversation temporaire
        setTimeout(() => {
          navigate(`/messages/${newConv.id}`, { 
            replace: true,
            state: { initialListingId: locationState.listingId }
          });
        }, 100);
      }
    }
  }, [locationState, conversationId, conversations, navigate]);
  
  // Chercher la conversation active (dans l'historique ou temporaire)
  const activeConversation = conversations.find(c => c.id === conversationId) || 
                            (tempConversation?.id === conversationId ? tempConversation : undefined);
  
  // Récupérer l'initialListingId depuis le state de navigation
  const navState = location.state as { initialListingId?: string } | null;
  const initialListingId = navState?.initialListingId || locationState?.listingId;
  
  const handleDeleteConversation = (convId: string) => {
    setConversations(conversations.filter(c => c.id !== convId));
    // Rediriger vers la messagerie principale
    navigate('/messages', { replace: true });
  };
  
  // Fonction pour ajouter une conversation à l'historique lors de l'envoi d'un message
  const handleAddToHistory = (conv: Conversation) => {
    if (tempConversation?.id === conv.id) {
      // Remplacer l'ID temporaire par un vrai ID
      const permanentConv = {
        ...conv,
        id: `conv_${Date.now()}`
      };
      setConversations(prev => [...prev, permanentConv]);
      setTempConversation(null);
      // Mettre à jour l'URL
      navigate(`/messages/${permanentConv.id}`, { replace: true });
      return permanentConv;
    }
    return conv;
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
            {conversations.length > 0 ? conversations.map(conv => (
              <ConversationItem key={conv.id} conv={conv} isActive={conv.id === conversationId} />
            )) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Vous devez être connecté pour voir vos messages.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 lg:w-3/4 ${conversationId ? 'block' : 'hidden md:block'}`}>
          {activeConversation ? (
            <ChatWindow 
              conversation={activeConversation} 
              onDelete={handleDeleteConversation}
              onAddToHistory={handleAddToHistory}
              initialListingId={initialListingId}
            />
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