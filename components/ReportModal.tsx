import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reportsService } from '../lib/reportsService';
import { userReportsService } from '../lib/userReportsService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'listing' | 'user';
  targetId: string; // ID de l'annonce ou de l'utilisateur signalé
}

// Mapping des raisons affichées vers les valeurs DB
const REASON_MAPPING: Record<string, 'spam' | 'inappropriate' | 'scam' | 'duplicate' | 'other'> = {
  'Arnaque ou escroquerie': 'scam',
  'Contenu mensonger ou description trompeuse': 'scam',
  'Photos non conformes ou volées': 'inappropriate',
  'Contenu illégal': 'inappropriate',
  'Contenu inapproprié ou choquant': 'inappropriate',
  'Annonce discriminatoire': 'inappropriate',
  'Spam': 'spam',
  'Doublon': 'duplicate',
  'Autre': 'other'
};

const LISTING_REASONS = [
  'Arnaque ou escroquerie',
  'Contenu mensonger ou description trompeuse',
  'Photos non conformes ou volées',
  'Contenu illégal',
  'Contenu inapproprié ou choquant',
  'Annonce discriminatoire',
  'Spam',
  'Doublon',
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
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      alert('Veuillez sélectionner une raison.');
      return;
    }

    if (!user?.id) {
      alert('Vous devez être connecté pour signaler.');
      return;
    }

    // Pour les listings, on utilise le nouveau système
    if (type === 'listing') {
      setLoading(true);
      try {
        const mappedReason = REASON_MAPPING[selectedReason] || 'other';
        console.log('📤 Envoi du signalement:', { listing_id: targetId, reason: mappedReason, userId: user.id });
        
        const result = await reportsService.createReport({
          listing_id: targetId,
          reason: mappedReason,
          description: description || undefined
        }, user.id);

        if (!result) {
          console.error('❌ Échec de création du signalement - result est null');
          alert('Erreur : Impossible de créer le signalement. Vérifiez la console.');
          return;
        }

        console.log('✅ Signalement créé avec succès:', result);
        alert('Signalement envoyé avec succès. Notre équipe examinera votre demande dans les plus brefs délais.');
        setSelectedReason('');
        setDescription('');
        onClose();
      } catch (error) {
        console.error('❌ Erreur lors du signalement:', error);
        alert(`Erreur : ${error instanceof Error ? error.message : 'Impossible de créer le signalement'}`);
      } finally {
        setLoading(false);
      }
    } else {
      // Pour les users, utiliser le nouveau système
      setLoading(true);
      try {
        console.log('📤 Envoi du signalement utilisateur:', { reported_user_id: targetId, reason: selectedReason, reporterId: user.id });
        
        const result = await userReportsService.createReport({
          reported_user_id: targetId,
          reason: selectedReason,
          description: description || undefined
        }, user.id);

        if (!result) {
          console.error('❌ Échec de création du signalement utilisateur - result est null');
          alert('Erreur : Impossible de créer le signalement. Vérifiez la console.');
          return;
        }

        console.log('✅ Signalement utilisateur créé avec succès:', result);
        alert('Signalement envoyé avec succès. Notre équipe examinera votre demande dans les plus brefs délais.');
        setSelectedReason('');
        setDescription('');
        onClose();
      } catch (error) {
        console.error('❌ Erreur lors du signalement utilisateur:', error);
        alert(`Erreur : ${error instanceof Error ? error.message : 'Impossible de créer le signalement'}`);
      } finally {
        setLoading(false);
      }
    }
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
                Votre email <span className="text-gray-500 font-normal">(N'apparaîtra pas dans le signalement)</span>
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition bg-white font-montserrat disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionnez une raison</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Description optionnelle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Ajoutez des détails supplémentaires..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition bg-white font-montserrat resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Envoi...' : 'Valider'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
