import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListingCard } from '../components/ListingCard';
import { BackButton } from '../components/BackButton';
import { ProtectedAction } from '../components/ProtectedAction';
import { useAuth } from '../contexts/AuthContext';
import { ReportModal } from '../components/ReportModal';
import { listingsService } from '../lib/listingsService';
import { Listing, User } from '../types';

const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const DefaultAvatarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `Il y a ${months} mois`;
  if (weeks > 0) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours}h`;
  if (minutes > 0) return `Il y a ${minutes}min`;
  return 'À l\'instant';
};

export const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { user: currentUser } = useAuth();
    const [showReportModal, setShowReportModal] = useState(false);
    const [userListings, setUserListings] = useState<Listing[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Si c'est le profil de l'utilisateur connecté
    const isOwnProfile = currentUser?.id === userId;

    // Charger les données de l'utilisateur et ses annonces
    useEffect(() => {
        const loadUserData = async () => {
            if (!userId) return;
            setLoading(true);
            
            // Si c'est notre profil, utiliser currentUser
            if (isOwnProfile && currentUser) {
                setUser(currentUser);
            } else {
                // Sinon, charger les données de l'autre utilisateur depuis une annonce
                const listings = await listingsService.getUserListings(userId);
                if (listings.length > 0 && listings[0].user) {
                    setUser(listings[0].user);
                }
            }
            
            // Charger les annonces
            const listings = await listingsService.getUserListings(userId);
            setUserListings(listings);
            setLoading(false);
        };
        loadUserData();
    }, [userId, currentUser, isOwnProfile]);

    if (loading) {
        return <div className="text-center py-20">Chargement...</div>;
    }

    if (!user && !isOwnProfile) {
        return <div className="text-center py-20">Utilisateur non trouvé.</div>;
    } 

    return (
        <div className="bg-gray-50">
            <BackButton />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-8 relative">
                        {/* Bouton Signaler - Pour profils externes (icône top-right) */}
                        {!isOwnProfile && (
                          <button
                            onClick={() => setShowReportModal(true)}
                            className="absolute top-4 right-4 text-red-600 hover:text-red-700 transition-colors p-2"
                            title="Signaler cette personne"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-primary-200" />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-gray-200 ring-4 ring-primary-200 flex items-center justify-center">
                                <DefaultAvatarIcon />
                            </div>
                        )}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 font-poppins">{user.name}</h1>
                            {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
                            
                            <div className="mt-4">
                                {isOwnProfile ? (
                                     <Link to="/settings" className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base">
                                        Modifier mon profil
                                     </Link>
                                ) : (
                                    <ProtectedAction>
                                        <Link 
                                            to="/messages" 
                                            state={{ recipientId: user.id }}
                                            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
                                        >
                                           <MailIcon /> Contacter {user.name}
                                        </Link>
                                    </ProtectedAction>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* User's Listings */}
                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-gray-800 font-poppins mb-6">Annonces de {user.name} ({userListings.length})</h2>
                        {userListings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                                {userListings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} getRelativeTime={getRelativeTime} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white text-center p-12 rounded-2xl shadow-sm border">
                                <p className="text-gray-500">{user.name} n'a aucune annonce active pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de signalement */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                type="user"
                targetId={user.id}
            />
        </div>
    );
};
