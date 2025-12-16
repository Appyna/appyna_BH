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
        <div className="min-h-screen w-full flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-teal-50">
            <div className="mx-auto w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-sm py-8 sm:py-10 px-6 sm:px-8 md:px-12 shadow-2xl rounded-2xl sm:rounded-3xl border border-white/20">
                    <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 sm:h-24 sm:w-24 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    
                    <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900 font-poppins px-2">
                        Inscription réussie !
                    </h2>
                    
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5 font-montserrat">
                        <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed px-2 font-medium">
                            Consultez votre boîte mail et cliquez sur le lien de validation pour activer votre compte.
                        </p>
                        
                        <p className="text-center text-sm sm:text-base text-gray-700 leading-relaxed px-2 font-medium">
                            Une fois votre adresse confirmée, appuyez sur le bouton ci-dessous pour vous connecter à votre compte Appyna.
                        </p>
                    </div>
                    
                    <div className="mt-6 sm:mt-8 text-center px-2">
                        <Link 
                            to="/" 
                            className="inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat text-sm sm:text-base"
                        >
                            Accéder à Appyna
                        </Link>
                    </div>
                    
                    <p className="mt-4 sm:mt-6 text-xs text-gray-500 text-center font-montserrat px-2">
                        Pensez à vérifier vos spams si l'email n'apparaît pas.
                    </p>
                </div>
            </div>
        </div>
    );
};
