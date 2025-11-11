import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/icons/Logo';
import { BackButton } from '../components/BackButton';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, resetPassword } = useAuth();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/');
        } else {
            // Messages d'erreur spécifiques
            if (result.error === 'email_not_confirmed') {
                setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.');
            } else if (result.error === 'invalid_credentials') {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
        
        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        
        const success = await resetPassword(resetEmail);
        
        if (success) {
            alert(`Un email de réinitialisation a été envoyé à ${resetEmail}. Vérifiez votre boîte de réception.`);
            setShowForgotPassword(false);
            setResetEmail('');
        } else {
            alert('Erreur lors de l\'envoi de l\'email. Vérifiez que l\'adresse est correcte.');
        }
        
        setResetLoading(false);
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-teal-50">
            <BackButton />
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 sm:mt-8 text-center text-3xl sm:text-4xl font-bold font-poppins">
                    <span className="text-gray-900">Bon retour sur </span>
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Appyna</span>
                    <span className="text-gray-900"> !</span>
                </h2>
                <p className="mt-2 sm:mt-3 text-center text-lg text-gray-600 font-montserrat">
                    Connectez-vous pour accéder à votre compte
                </p>
                <p className="mt-3 sm:mt-4 text-center text-sm text-gray-500">
                    Pas encore de compte ?{' '}
                    <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                        Créez-en un maintenant
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
                    <form className="space-y-8" onSubmit={handleSubmit}>
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
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-montserrat">
                                    Se souvenir de moi
                                </label>
                            </div>

                            <div className="text-sm">
                                <button 
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal de mot de passe oublié */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
                        <button
                            onClick={() => setShowForgotPassword(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900 font-poppins mb-2 text-center">
                            Mot de passe oublié ?
                        </h3>
                        <p className="text-sm text-gray-600 font-montserrat mb-6 text-center">
                            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Adresse email
                                </label>
                                <input
                                    id="reset-email"
                                    name="reset-email"
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-montserrat"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-1 py-3 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resetLoading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
