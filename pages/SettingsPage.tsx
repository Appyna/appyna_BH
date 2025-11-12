import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from '../components/BackButton';
import { listingsService } from '../lib/listingsService';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const DefaultAvatarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const SettingsPage: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [hasCustomAvatar, setHasCustomAvatar] = useState(!!user?.avatarUrl);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 font-poppins mb-4">Accès non autorisé</h2>
                    <p className="text-gray-600 font-montserrat">Vous devez être connecté pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Créer une URL temporaire pour prévisualiser l'image
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
            setHasCustomAvatar(true);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarUrl('');
        setHasCustomAvatar(false);
    };

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 180) {
            setBio(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Normaliser le nom : trim + réduire espaces multiples à un seul
        const normalizedName = name.trim().replace(/\s+/g, ' ');
        
        // Vérifier si le nom a changé et s'il est disponible
        if (normalizedName !== user.name) {
            const isAvailable = await listingsService.checkUsernameAvailable(normalizedName, user.id);
            if (!isAvailable) {
                alert('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');
                return;
            }
        }
        
        // Mise à jour du profil via l'AuthContext
        updateProfile({
            name: normalizedName,
            bio: bio,
            avatarUrl: hasCustomAvatar ? avatarUrl : '',
        });
        
        alert('Profil mis à jour avec succès !');
        
        // Rediriger vers le profil
        navigate(`/profile/${user.id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50">
            <BackButton />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-poppins mb-2">
                            Modifier mon profil
                        </h1>
                        <p className="text-gray-600 font-montserrat">
                            Personnalisez vos informations publiques
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Photo de profil */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center">
                                    <PhotoIcon />
                                    Photo de profil
                                </label>
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative">
                                        {hasCustomAvatar && avatarUrl ? (
                                            <img 
                                                src={avatarUrl} 
                                                alt="Aperçu" 
                                                className="h-32 w-32 rounded-full object-cover ring-4 ring-primary-200 shadow-lg"
                                            />
                                        ) : (
                                            <div className="h-32 w-32 rounded-full bg-gray-200 ring-4 ring-primary-200 shadow-lg flex items-center justify-center">
                                                <DefaultAvatarIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full space-y-3">
                                        <div className="flex gap-2 sm:gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                                <div className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 border border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300 font-montserrat font-semibold text-xs sm:text-sm">
                                                    <UploadIcon />
                                                    {hasCustomAvatar ? 'Changer la photo' : 'Ajouter une photo'}
                                                </div>
                                            </label>
                                            {hasCustomAvatar && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveAvatar}
                                                    className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 font-montserrat font-semibold text-xs sm:text-sm"
                                                >
                                                    <TrashIcon />
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 font-montserrat">
                                            {hasCustomAvatar ? '' : 'Aucune photo de profil définie'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Nom */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <UserIcon />
                                    Nom complet <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    maxLength={50}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                    placeholder="Votre nom"
                                />
                                <p className="mt-1 text-xs text-gray-500">{name.length}/50 caractères</p>
                            </div>

                            {/* Email (non modifiable) */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed font-montserrat"
                                />
                                <p className="mt-2 text-sm text-gray-500 font-montserrat">
                                    L'adresse email ne peut pas être modifiée
                                </p>
                            </div>

                            {/* Bio */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <PencilIcon />
                                    Biographie
                                </label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={handleBioChange}
                                    maxLength={180}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat resize-none"
                                    placeholder="Parlez un peu de vous..."
                                />
                                <p className="mt-2 text-sm text-gray-500 font-montserrat">
                                    {bio.length}/180 caractères
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                    className="flex-1 py-2.5 px-5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 px-5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
