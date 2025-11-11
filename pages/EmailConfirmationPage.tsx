import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/icons/Logo';

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const EmailConfirmationPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-teal-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl rounded-3xl sm:px-12 border border-white/20">
                    <EmailIcon />
                    
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-poppins">
                        Inscription réussie !
                    </h2>
                    
                    <p className="mt-4 text-center text-lg text-gray-600 font-montserrat">
                        Votre compte a été créé avec succès.
                    </p>
                    
                    <div className="mt-8 bg-primary-50 border border-primary-200 rounded-2xl p-6">
                        <p className="text-center text-gray-700 font-montserrat mb-4">
                            <strong>Dernière étape :</strong> Vérifiez votre boîte email
                        </p>
                        
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="bg-primary-500 rounded-full p-1">
                                        <CheckIcon />
                                    </div>
                                </div>
                                <p className="ml-3">
                                    Nous vous avons envoyé un email de confirmation
                                </p>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="bg-primary-500 rounded-full p-1">
                                        <CheckIcon />
                                    </div>
                                </div>
                                <p className="ml-3">
                                    Cliquez sur le lien dans l'email pour activer votre compte
                                </p>
                            </div>
                            
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="bg-primary-500 rounded-full p-1">
                                        <CheckIcon />
                                    </div>
                                </div>
                                <p className="ml-3">
                                    Une fois confirmé, vous pourrez vous connecter et utiliser Appyna
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800 text-center">
                            N'oubliez pas de vérifier vos <strong>spams</strong> si vous ne voyez pas l'email
                        </p>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                    
                    <p className="mt-6 text-center text-sm text-gray-500 font-montserrat">
                        Un problème ? <a href="mailto:support@appyna.com" className="text-primary-600 hover:text-primary-500 font-semibold">Contactez-nous</a>
                    </p>
                </div>
            </div>
        </div>
    );
};
