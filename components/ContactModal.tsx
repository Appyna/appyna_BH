import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getAdminUserId, ADMIN_DISPLAY_NAME } from '../lib/adminConfig';
import { useNavigate } from 'react-router-dom';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour nous contacter');
      return;
    }

    if (!message.trim()) {
      setError('Veuillez saisir un message');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Récupérer l'ID du compte admin
      console.log('🔍 Récupération ID admin...');
      const adminId = await getAdminUserId();
      console.log('✅ Admin ID:', adminId);
      
      if (!adminId) {
        throw new Error('Impossible de contacter le support pour le moment');
      }

      // Utiliser la fonction SQL pour restaurer ou créer la conversation
      // Cette fonction bypasse les RLS pour gérer les conversations soft deleted
      console.log('🔍 Restauration/création conversation de support...');
      const { data: convId, error: convError } = await supabase
        .rpc('restore_or_create_support_conversation', {
          p_user_id: user.id,
          p_admin_id: adminId
        });

      if (convError || !convId) {
        console.error('❌ Erreur conversation:', convError);
        throw convError || new Error('Impossible de créer la conversation');
      }

      const conversationId = convId;
      console.log('✅ Conversation prête:', conversationId);

      // Envoyer le message
      console.log('📤 Envoi du message...');
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          text: message, // La colonne s'appelle "text" pas "content"
        });

      if (messageError) {
        console.error('❌ Erreur envoi message:', messageError);
        throw messageError;
      }
      console.log('✅ Message envoyé');

      // Rediriger vers la messagerie avec la conversation ouverte
      console.log('🔀 Redirection vers:', `/messages/${conversationId}`);
      navigate(`/messages/${conversationId}`);
      onClose();
      setMessage('');
    } catch (err: any) {
      console.error('❌ ERREUR CONTACT:', err);
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-poppins">
            Contactez-nous
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Vous devez être connecté pour nous contacter
            </p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Se connecter
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4 font-montserrat">
              Envoyez un message à l'équipe <span className="font-semibold">{ADMIN_DISPLAY_NAME}</span>. 
              Nous vous répondrons directement dans votre messagerie.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre question ou problème..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-montserrat"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg hover:from-primary-700 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
