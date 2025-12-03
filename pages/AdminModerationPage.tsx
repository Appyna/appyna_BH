import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { reportsService, Report } from '../lib/reportsService';
import { userReportsService, UserReport } from '../lib/userReportsService';

const AdminModerationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // État pour les signalements d'annonces
  const [reports, setReports] = useState<Report[]>([]);
  
  // État pour les signalements d'utilisateurs
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  
  // État commun
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'listings' | 'users'>('listings');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedUserReport, setSelectedUserReport] = useState<UserReport | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'ban' | 'unban' | null>(null);
  const [moderatorNote, setModeratorNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.is_admin !== true) {
      alert('Accès refusé. Vous devez être administrateur pour accéder à cette page.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Charger les signalements
  useEffect(() => {
    if (reportType === 'listings') {
      loadReports();
    } else {
      loadUserReports();
    }
  }, [filter, reportType]);

  const loadReports = async () => {
    setLoading(true);
    const statusFilter = filter === 'all' ? undefined : filter;
    console.log('🔍 Chargement des signalements d\'annonces, filtre:', statusFilter);
    const data = await reportsService.getAllReports(statusFilter);
    console.log('� Signalements d\'annonces récupérés:', data.length);
    setReports(data);
    setLoading(false);
  };

  const loadUserReports = async () => {
    setLoading(true);
    const statusFilter = filter === 'all' ? undefined : filter;
    console.log('🔍 Chargement des signalements d\'utilisateurs, filtre:', statusFilter);
    const data = await userReportsService.getAllReports(statusFilter);
    console.log('📋 Signalements d\'utilisateurs récupérés:', data.length);
    setUserReports(data);
    setLoading(false);
  };

  const handleAction = async () => {
    if (!user || !actionType) return;

    setProcessing(true);
    let success = false;

    try {
      // Gestion des signalements d'annonces
      if (selectedReport) {
        switch (actionType) {
          case 'approve':

            success = await reportsService.approveReport(selectedReport.id, user.id, moderatorNote);
            break;
          case 'reject':

            success = await reportsService.rejectReport(selectedReport.id, user.id, moderatorNote);
            break;
          case 'ban':
            if (selectedReport.listing?.user_id) {

              success = await reportsService.banUser(selectedReport.listing.user_id, moderatorNote);
              if (success) {
                await reportsService.approveReport(selectedReport.id, user.id, `Utilisateur banni: ${moderatorNote}`);
              }
            } else {
              alert('Erreur: Impossible de trouver le propriétaire de l\'annonce');
              return;
            }
            break;
        }
      }
      
      // Gestion des signalements d'utilisateurs
      if (selectedUserReport) {
        switch (actionType) {
          case 'approve':

            success = await userReportsService.approveReport(selectedUserReport.id, user.id, moderatorNote);
            break;
          case 'reject':

            success = await userReportsService.rejectReport(selectedUserReport.id, user.id, moderatorNote);
            break;
          case 'unban':
            if (selectedUserReport.reported_user_id) {

              success = await userReportsService.unbanUser(selectedUserReport.reported_user_id);
            }
            break;
        }
      }

      if (success) {
        alert('Action effectuée avec succès !');
        setShowActionModal(false);
        setSelectedReport(null);
        setSelectedUserReport(null);
        setModeratorNote('');
        reportType === 'listings' ? loadReports() : loadUserReports();
      } else {
        alert('Erreur lors de l\'action. Vérifiez la console.');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'action:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Action échouée'}`);
    } finally {
      setProcessing(false);
    }
  };

  const openActionModal = (report: Report | UserReport, type: 'approve' | 'reject' | 'ban' | 'unban', isUserReport = false) => {
    if (isUserReport) {
      setSelectedUserReport(report as UserReport);
      setSelectedReport(null);
    } else {
      setSelectedReport(report as Report);
      setSelectedUserReport(null);
    }
    setActionType(type);
    setShowActionModal(true);
    setModeratorNote('');
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: '🚫 Spam',
      inappropriate: '⚠️ Contenu inapproprié',
      scam: '💰 Arnaque',
      duplicate: '📋 Doublon',
      other: '❓ Autre'
    };
    return labels[reason] || reason;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      resolved: 'Traité',
      rejected: 'Rejeté'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛡️ Modération</h1>
          <p className="text-gray-600">Gestion des signalements</p>
        </div>

        {/* Navigation Admin */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <a
              href="/admin/dashboard"
              className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              📊 Dashboard
            </a>
            <a
              href="/admin/moderation"
              className="px-4 py-2 rounded-lg font-semibold bg-primary-600 text-white"
            >
              🛡️ Modération
            </a>
          </div>
        </div>

        {/* Onglets Type de signalement */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap mb-4 pb-4 border-b">
            <button
              onClick={() => setReportType('listings')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                reportType === 'listings'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Annonces
            </button>
            <button
              onClick={() => setReportType('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                reportType === 'users'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👤 Utilisateurs
            </button>
          </div>

          {/* Filtres Status */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({reportType === 'listings' ? reports.length : userReports.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'resolved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Traités
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetés
            </button>
          </div>
        </div>

        {/* Liste des signalements d'annonces */}
        {reportType === 'listings' && (
          <>
            {reports.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucun signalement d'annonce pour ce filtre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {report.listing?.title || 'Annonce supprimée'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{getReasonLabel(report.reason)}</span>
                          <span>•</span>
                          <span>Par: {report.reporter?.name || report.reporter?.email || 'Utilisateur'}</span>
                          <span>•</span>
                          <span>{new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    {report.description && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-gray-700 text-sm">{report.description}</p>
                      </div>
                    )}

                    {report.listing && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Catégorie:</strong> {report.listing.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Statut annonce:</strong> {report.listing.is_hidden ? '❌ Masquée' : '✅ Visible'}
                        </p>
                      </div>
                    )}

                    {report.moderator_note && (
                      <div className="mb-4 p-3 bg-purple-50 rounded">
                        <p className="text-sm font-semibold text-purple-900 mb-1">Note du modérateur:</p>
                        <p className="text-sm text-purple-700">{report.moderator_note}</p>
                      </div>
                    )}

                    {report.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openActionModal(report, 'approve', false)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          ✅ Approuver (masquer annonce)
                        </button>
                        <button
                          onClick={() => openActionModal(report, 'reject', false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                        >
                          ❌ Rejeter
                        </button>
                        <button
                          onClick={() => openActionModal(report, 'ban', false)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                          🚫 Bannir utilisateur
                        </button>
                        {report.listing && (
                          <button
                            onClick={() => window.open(`/listing/${report.listing_id}`, '_blank')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                          >
                            👁️ Voir l'annonce
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Liste des signalements d'utilisateurs */}
        {reportType === 'users' && (
          <>
            {userReports.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucun signalement d'utilisateur pour ce filtre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          👤 {report.reported_user?.name || report.reported_user?.email || 'Utilisateur'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{getReasonLabel(report.reason)}</span>
                          <span>•</span>
                          <span>Par: {report.reporter?.name || report.reporter?.email || 'Utilisateur'}</span>
                          <span>•</span>
                          <span>{new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    {report.description && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-gray-700 text-sm">{report.description}</p>
                      </div>
                    )}

                    {report.reported_user && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Email:</strong> {report.reported_user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Statut utilisateur:</strong> {report.reported_user.is_banned ? '🚫 Banni' : '✅ Actif'}
                        </p>
                      </div>
                    )}

                    {report.moderator_note && (
                      <div className="mb-4 p-3 bg-purple-50 rounded">
                        <p className="text-sm font-semibold text-purple-900 mb-1">Note du modérateur:</p>
                        <p className="text-sm text-purple-700">{report.moderator_note}</p>
                      </div>
                    )}

                    {report.status === 'pending' && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openActionModal(report, 'approve', true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                        >
                          🚫 Bannir utilisateur
                        </button>
                        <button
                          onClick={() => openActionModal(report, 'reject', true)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                        >
                          ❌ Rejeter
                        </button>
                        {report.reported_user && (
                          <button
                            onClick={() => window.open(`/profile/${report.reported_user_id}`, '_blank')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                          >
                            👁️ Voir le profil
                          </button>
                        )}
                      </div>
                    )}

                    {report.status === 'resolved' && report.reported_user?.is_banned && (
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openActionModal(report, 'unban', true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          ✅ Débannir utilisateur
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal d'action */}
        {showActionModal && (selectedReport || selectedUserReport) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4">
                {actionType === 'approve' && selectedReport && '✅ Approuver le signalement (masquer annonce)'}
                {actionType === 'approve' && selectedUserReport && '🚫 Bannir l\'utilisateur'}
                {actionType === 'reject' && '❌ Rejeter le signalement'}
                {actionType === 'ban' && '🚫 Bannir l\'utilisateur'}
                {actionType === 'unban' && '✅ Débannir l\'utilisateur'}
              </h3>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  {actionType === 'approve' && selectedReport && 'L\'annonce sera masquée et ne sera plus visible publiquement.'}
                  {actionType === 'approve' && selectedUserReport && 'L\'utilisateur sera banni, déconnecté et toutes ses annonces seront masquées.'}
                  {actionType === 'reject' && 'Le signalement sera marqué comme rejeté.'}
                  {actionType === 'ban' && 'L\'utilisateur sera banni et toutes ses annonces seront masquées.'}
                  {actionType === 'unban' && 'L\'utilisateur sera débanni et pourra se reconnecter.'}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Note (optionnelle)</label>
                <textarea
                  value={moderatorNote}
                  onChange={(e) => setModeratorNote(e.target.value)}
                  placeholder="Ajoutez une note..."
                  className="w-full border rounded-lg p-2 h-24"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                >
                  {processing ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModerationPage;
