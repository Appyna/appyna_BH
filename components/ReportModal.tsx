import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'listing' | 'user';
  targetId: string; // ID de l'annonce ou de l'utilisateur signalé
}

const LISTING_REASONS = [
  'Arnaque ou escroquerie',
  'Contenu mensonger ou description trompeuse',
  'Photos non conformes ou volées',
  'Contenu illégal',
  'Contenu inapproprié ou choquant',
  'Annonce discriminatoire',
  'Autre'
];

const USER_REASONS = [
  'Comportement frauduleux',
  'Propos insultants, menaçants ou inappropriés',
  'Spam ou harcèlement',
  "Vol d'identité ou d'informations",
  'Publicité abusive',
  "Usurpation de marque ou d'entreprise",
  "Publication d'annonces illégales",
  'Autres'
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, type, targetId }) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      alert('Veuillez sélectionner une raison.');
      return;
    }
    
    // En production: envoyer le signalement au backend avec toutes les infos
    const reportData = {
      type: type, // 'listing' ou 'user'
      targetId: targetId, // ID de l'annonce ou de l'utilisateur signalé
      targetType: type === 'listing' ? 'Annonce' : 'Utilisateur',
      reportedBy: user?.email,
      reportedByUserId: user?.id,
      reason: selectedReason,
      timestamp: new Date().toISOString(),
      // Ces informations permettent à l'admin de savoir exactement ce qui est signalé
      referenceUrl: type === 'listing' 
        ? `/listing/${targetId}` 
        : `/profile/${targetId}`
    };
    
    console.log('📧 Signalement envoyé au backend admin:', reportData);
    
    alert('Signalement envoyé avec succès. Notre équipe examinera votre demande dans les plus brefs délais.');
    setSelectedReason('');
    onClose();
  };

  if (!isOpen) return null;

  const reasons = type === 'listing' ? LISTING_REASONS : USER_REASONS;
  const title = type === 'listing' ? 'Signaler cette annonce' : 'Signaler cette personne';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins text-center mb-2">{title}</h2>

          <p className="text-gray-600 font-montserrat mb-8 text-center text-sm sm:text-base">
            Précisez la raison de votre signalement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (pré-rempli et non modifiable) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                Votre email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-montserrat"
              />
            </div>

            {/* Raison du signalement */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                Raison du signalement
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition bg-white font-montserrat"
              >
                <option value="">Sélectionnez une raison</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
              >
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
