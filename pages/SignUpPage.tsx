import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/icons/Logo';
import { useAuth } from '../contexts/AuthContext';
import { listingsService } from '../lib/listingsService';

export const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedVeracity, setAcceptedVeracity] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            setError('Veuillez accepter les conditions d\'utilisation pour continuer.');
            return;
        }
        if (!acceptedVeracity) {
            setError('Veuillez confirmer la véracité de votre profil pour continuer.');
            return;
        }
        
        setError('');
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const rawName = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Normaliser le nom : trim + réduire espaces multiples à un seul
        const name = rawName.trim().replace(/\s+/g, ' ');

        // Vérifier si le nom d'utilisateur est disponible
        const isAvailable = await listingsService.checkUsernameAvailable(name);
        if (!isAvailable) {
            setError('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.');
            setLoading(false);
            return;
        }

        const success = await register({ name, email, password });
        
        if (success) {
            // Rediriger vers la page de confirmation email
            navigate('/email-confirmation');
        } else {
            setError('Cet email est déjà utilisé. Vous ne pouvez pas créer 2 comptes avec le même email.');
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-teal-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 sm:mt-8 text-center text-3xl sm:text-4xl font-bold font-poppins">
                    <span className="text-gray-900">Bienvenue sur </span>
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Appyna</span>
                    <span className="text-gray-900"> !</span>
                </h2>
                <p className="mt-2 sm:mt-3 text-center text-lg text-gray-600 font-montserrat">
                    Créez votre compte en quelques clics
                </p>
                <p className="mt-3 sm:mt-4 text-center text-sm text-gray-500">
                    Déjà membre ?{' '}
                    <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                        Connectez-vous ici
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-8 sm:py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-12 border border-white/20">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Nom complet
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                maxLength={50}
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="Votre nom complet"
                            />
                            <p className="mt-1 text-xs text-gray-500">Maximum 50 caractères</p>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="Minimum 8 caractères"
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-xs">
                                <label htmlFor="terms" className="text-gray-700 font-montserrat">
                                    J'accepte les{' '}
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(true)}
                                        className="font-semibold text-primary-600 hover:text-primary-500 underline transition-colors"
                                    >
                                        conditions d'utilisation
                                    </button>
                                    {' '}du site Appyna.
                                </label>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="veracity"
                                    name="veracity"
                                    type="checkbox"
                                    checked={acceptedVeracity}
                                    onChange={(e) => setAcceptedVeracity(e.target.checked)}
                                    required
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-xs">
                                <label htmlFor="veracity" className="text-gray-700 font-montserrat">
                                    Je garantis la véracité de mon profil et mes annonces, et reconnais que des informations ou profils tiers peuvent être inexacts, ce dont j'assume la responsabilité.
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Inscription...' : 'Créer mon compte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal des Conditions d'utilisation */}
            {showTerms && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden relative">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                                Conditions d'utilisation de Appyna
                            </h3>
                            <button
                                onClick={() => setShowTerms(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-88px)]">
                            <div className="prose prose-sm max-w-none font-montserrat text-gray-700">
                                <p className="text-center text-gray-500 italic">
                                    Le contenu des conditions d'utilisation sera ajouté ici prochainement.
                                </p>
                                {/* Le contenu sera ajouté ici */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
