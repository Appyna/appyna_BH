
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProtectedAction } from '../components/ProtectedAction';
import { useAuth } from '../contexts/AuthContext';
import { EditListingModal } from '../components/EditListingModal';
import { ReportModal } from '../components/ReportModal';
import { BoostListingModal } from '../components/BoostListingModal';
import { Listing } from '../types';
import { listingsService } from '../lib/listingsService';

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-4-4-4" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const ExpandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M21 7V5a2 2 0 00-2-2h-2M21 17v2a2 2 0 01-2 2h-2" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${filled ? 'text-red-500' : 'text-white'}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);


export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour la galerie
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour les modals de gestion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState('24h');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isAutoBoostModal, setIsAutoBoostModal] = useState(false);
  
  // État pour la bannière de notification
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Charger l'annonce depuis Supabase
  useEffect(() => {
    const loadListing = async () => {
      if (!id) return;
      setLoading(true);
      const data = await listingsService.getListingById(id);
      console.log('Annonce chargée depuis Supabase:', data);
      console.log('Images de l\'annonce:', data?.images);
      setListing(data);
      setLoading(false);
    };
    loadListing();
  }, [id]);

  // Vérifier si c'est l'annonce de l'utilisateur connecté
  const isOwnListing = currentUser?.id === listing?.userId;

  // Ouvrir automatiquement le modal de boost après création d'annonce
  useEffect(() => {
    const shouldShowBoost = searchParams.get('showBoost') === 'true';
    console.log('🚀 Boost check:', { 
      shouldShowBoost, 
      isOwnListing, 
      hasListing: !!listing, 
      loading,
      currentUserId: currentUser?.id,
      listingUserId: listing?.userId
    });
    
    if (shouldShowBoost && isOwnListing && listing && !loading) {
      console.log('✅ Opening boost modal automatically');
      setShowBoostModal(true);
      setIsAutoBoostModal(true);
      // Supprimer le paramètre de l'URL après ouverture
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('showBoost');
      setSearchParams(newSearchParams);
    }
  }, [searchParams, isOwnListing, listing, loading, currentUser, setSearchParams]);

  // Réinitialiser le flag auto-boost quand le modal se ferme
  useEffect(() => {
    if (!showBoostModal) {
      setIsAutoBoostModal(false);
    }
  }, [searchParams, isOwnListing, listing, loading, currentUser, setSearchParams]);
  
  // État favori
  const isFavorite = currentUser?.favorites.includes(listing?.id || '') || false;
  
  const handleToggleFavorite = () => {
    if (listing) {
      toggleFavorite(listing.id);
    }
  };
  
  // Vérifier si l'annonce est en cours de boost
  const isCurrentlyBoosted = listing?.boostedUntil && new Date(listing.boostedUntil) > new Date();

  // Fonction pour afficher la bannière pendant 3 secondes
  const showBanner = (message: string) => {
    setBannerMessage(message);
    setTimeout(() => {
      setBannerMessage(null);
    }, 3000);
  };

  // Utiliser les images de l'annonce
  const images = listing?.images && listing.images.length > 0 ? listing.images : [undefined];
  const hasMultipleImages = images.length > 1 && images[0] !== undefined;

  // Debug: afficher les URLs des images
  useEffect(() => {
    if (images && images.length > 0) {
      console.log('🖼️ Images affichées dans la galerie:', images);
      images.forEach((img, idx) => {
        console.log(`Image ${idx + 1}:`, img);
      });
    }
  }, [listing]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteListing = async () => {
    if (!listing) return;
    
    try {
      const success = await listingsService.deleteListing(listing.id);
      
      if (success) {
        alert('Annonce supprimée avec succès !');
        setShowDeleteModal(false);
        navigate('/');
      } else {
        alert('Erreur lors de la suppression de l\'annonce');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Une erreur est survenue lors de la suppression');
    }
  };

  const handleBoostListing = async (days: number) => {
    if (!listing) return;
    
    try {
      const success = await listingsService.boostListing(listing.id, days);
      
      if (success) {
        alert(`Annonce boostée avec succès pour ${days} jours !`);
        setShowBoostModal(false);
        // Recharger les données de l'annonce pour afficher le badge
        window.location.reload();
      } else {
        alert('Erreur lors du boost de l\'annonce');
      }
    } catch (error) {
      console.error('Error boosting listing:', error);
      alert('Une erreur est survenue lors du boost');
    }
  };

  const handleBoostClick = () => {
    if (isCurrentlyBoosted) {
      showBanner('Annonce déjà en cours de boost.');
      return;
    }
    setShowBoostModal(true);
  };

  const handleEditClick = () => {
    if (isCurrentlyBoosted) {
      showBanner('Modification non disponible pour une annonce en cours de boost.');
      return;
    }
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedListing: Partial<Listing>) => {
    if (!listing) return;

    try {
      console.log('Updating listing:', listing.id, updatedListing);
      const success = await listingsService.updateListing(listing.id, updatedListing);
      
      if (success) {
        alert('Annonce modifiée avec succès !');
        setShowEditModal(false);
        // Recharger les données de l'annonce
        window.location.reload();
      } else {
        alert('Erreur lors de la modification de l\'annonce');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Erreur lors de la modification de l\'annonce');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  if (!listing) {
    return <div className="text-center py-20">Annonce non trouvée.</div>;
  }

  const user = listing.user;

  return (
    <div className="bg-white">
      {/* Bannière de notification */}
      {bannerMessage && (
        <div className="fixed top-0 left-0 right-0 z-[100] animate-fade-in">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-4 shadow-2xl border-b-4 border-orange-600">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold text-sm sm:text-base font-montserrat">{bannerMessage}</span>
              </div>
              <button 
                onClick={() => setBannerMessage(null)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bouton retour intelligent */}
      <BackButton />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Galerie photos */}
            <div className="relative mb-6">
              <div 
                className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 cursor-pointer group"
                onClick={openModal}
              >
                <ImageWithFallback 
                  key={`main-${currentImageIndex}-${images[currentImageIndex]}`}
                  src={images[currentImageIndex]} 
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                
                {/* Badge Boosté - affiché uniquement si l'annonce est boostée */}
                {isCurrentlyBoosted && (
                  <div className="absolute top-4 left-4 flex items-center bg-gradient-to-r from-primary-600/90 to-secondary-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    {isOwnListing && listing.boostedUntil ? (() => {
                      const now = new Date();
                      const end = new Date(listing.boostedUntil);
                      const diffMs = end.getTime() - now.getTime();
                      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
                      
                      if (diffDays > 1) {
                        return `BOOSTÉ - Reste ${diffDays}j`;
                      } else if (diffHours > 1) {
                        return `BOOSTÉ - Reste ${diffHours}h`;
                      } else {
                        return 'BOOSTÉ - Expire bientôt';
                      }
                    })() : 'BOOSTÉ'}
                  </div>
                )}
                
                {/* Bouton favori - uniquement pour annonces des autres */}
                {!isOwnListing && (
                  <ProtectedAction>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite();
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300 backdrop-blur-sm hover:scale-110 z-10"
                      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <HeartIcon filled={isFavorite} />
                    </button>
                  </ProtectedAction>
                )}
                
                {/* Overlay pour agrandir */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                    <ExpandIcon />
                  </div>
                </div>
              </div>

              {/* Navigation des images - seulement si multiple images valides */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRightIcon />
                  </button>

                  {/* Indicateurs - seulement si multiple images */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white shadow-lg' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="border-b pb-6 mb-6">
                <span className="text-sm font-semibold bg-secondary-100 text-secondary-800 py-1 px-3 rounded-full">{listing.type}</span>
                <h1 className="text-xl md:text-2xl font-bold mt-2 font-poppins text-gray-900">{listing.title}</h1>
                 <p className="text-xl md:text-2xl font-bold text-primary-600 mt-3">
                    {listing.price ? `${listing.price.toLocaleString('fr-FR')} ₪` : 'Aucun prix'}
                </p>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            
            <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 font-poppins">Détails</h3>
                  
                  {/* Bouton Signaler - Mobile uniquement (icône) pour annonces externes */}
                  {!isOwnListing && (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="sm:hidden text-red-600 hover:text-red-700 transition-colors p-2"
                      title="Signaler l'annonce"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex items-center"><CalendarIcon />Publié le {new Date(listing.createdAt).toLocaleDateString('fr-FR')}</div>
                    <div className="flex items-center"><LocationIcon />{listing.city}</div>
                    <div className="flex items-center"><TagIcon />{listing.category}</div>
                </div>
                
                {/* Bouton Signaler - Desktop uniquement (texte) pour annonces externes */}
                {!isOwnListing && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="hidden sm:flex items-center justify-center w-full mt-6 py-2.5 px-4 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-semibold text-sm font-montserrat"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                    Signaler l'annonce
                  </button>
                )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-50 p-6 rounded-2xl border">
               {isOwnListing ? (
                 /* Boutons de gestion pour l'annonce du user */
                 <div className="space-y-3">
                   <h3 className="font-bold text-lg text-gray-800 mb-4 font-poppins">Gérer mon annonce</h3>
                   
                   <button
                     onClick={handleBoostClick}
                     disabled={isCurrentlyBoosted}
                     className={`w-full flex items-center justify-center ${
                       isCurrentlyBoosted 
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                         : 'bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white'
                     } font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 ${
                       !isCurrentlyBoosted && 'transform hover:scale-105 shadow-lg'
                     } text-sm`}
                   >
                     <RocketIcon /> Booster l'annonce
                   </button>
                   
                   <button
                     onClick={handleEditClick}
                     disabled={isCurrentlyBoosted}
                     className={`w-full flex items-center justify-center ${
                       isCurrentlyBoosted 
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                         : 'bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white'
                     } font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 ${
                       !isCurrentlyBoosted && 'transform hover:scale-105 shadow-lg'
                     } text-sm`}
                   >
                     <EditIcon /> Modifier l'annonce
                   </button>
                   
                   <button
                     onClick={() => setShowDeleteModal(true)}
                     className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                   >
                     <TrashIcon /> Supprimer l'annonce
                   </button>
                 </div>
               ) : user ? (
                 /* Contact pour les annonces des autres */
                 <>
                   <div className="flex items-center mb-6">
                     <Link to={`/profile/${user.id}`}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover mr-4" />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                     </Link>
                     <div className="flex-1 min-w-0">
                        <Link 
                          to={`/profile/${user.id}`} 
                          className="font-bold text-lg text-gray-800 hover:text-primary-600 block overflow-hidden text-ellipsis whitespace-nowrap"
                          title={user.name}
                        >
                          {user.name}
                        </Link>
                        <p className="text-sm text-gray-500">Membre sur Appyna</p>
                     </div>
                   </div>
                   
                   <ProtectedAction>
                     <Link to="/messages" state={{ recipientId: user.id, listingId: listing.id }} className="w-full flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base">
                       <MessageIcon/> Contacter
                     </Link>
                   </ProtectedAction>

                   <div className="text-center mt-6">
                     <Link 
                       to={`/profile/${user.id}`} 
                       className="text-sm font-semibold text-primary-600 hover:underline inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                       title={`Voir toutes les annonces de ${user.name}`}
                     >
                        Voir toutes les annonces de {user.name}
                     </Link>
                   </div>
                 </>
               ) : null}
            </div>
          </div>
          
        </div>
      </div>

      {/* Modal pour agrandir les images */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Image agrandie */}
            <ImageWithFallback 
              key={`modal-${currentImageIndex}-${images[currentImageIndex]}`}
              src={images[currentImageIndex]} 
              alt={`${listing.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Bouton fermer */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-300 hover:scale-110"
            >
              <CloseIcon />
            </button>

            {/* Navigation dans la modal - seulement si multiple images valides */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronRightIcon />
                </button>

                {/* Compteur d'images - seulement si multiple images */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Indicateurs dans la modal - seulement si multiple images */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins mb-4 text-center">
              Supprimer l'annonce ?
            </h3>
            <p className="text-gray-600 font-montserrat mb-6 text-center text-sm sm:text-base">
              Êtes-vous sûr de vouloir supprimer définitivement cette annonce ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteListing}
                className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-lg font-montserrat"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de boost */}
      <BoostListingModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        showSuccessMessage={isAutoBoostModal}
      />

      {/* Modal d'édition */}
      {showEditModal && (
        <EditListingModal
          listing={listing}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal de signalement */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="listing"
        targetId={listing.id}
      />
    </div>
  );
};
