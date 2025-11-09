import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from './icons/Logo';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';

// Dummy component for icons - replace with actual SVGs if needed
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Refs pour détecter les clics en dehors
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En production: envoyer le message à l'API
    alert('Message envoyé avec succès ! Un membre de l\'équipe Appyna vous répondra dans les plus brefs délais.');
    setContactMessage('');
    setShowContactModal(false);
    setIsProfileOpen(false);
  };

  // Fermer les menus au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer le menu profil si clic en dehors
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      
      // Fermer le menu settings si clic en dehors
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      
      // Fermer le menu mobile si clic en dehors (sauf sur le bouton hamburger)
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyer l'écouteur lors du démontage
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsMenuOpen]);

  return (
    <>
    <header className="bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-purple-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center md:ml-0 ml-2">
            <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <Logo />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/create" className="flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-sm">
              <PlusIcon />
              Poster une annonce
            </Link>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 hover:bg-purple-50 p-2 rounded-xl transition-colors">
                   <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-200" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 ring-1 ring-black ring-opacity-5 border border-purple-100">
                    <div className="px-4 py-3 border-b border-purple-100">
                      <p className="text-sm font-semibold text-gray-800 font-poppins">{user.name}</p>
                    </div>
                    <NavLink to={`/profile/${user.id}`} className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => setIsProfileOpen(false)}>Mon Profil</NavLink>
                    <NavLink to="/messages" className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => setIsProfileOpen(false)}>Messagerie</NavLink>
                    <NavLink to="/favorites" className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => setIsProfileOpen(false)}>Mes favoris</NavLink>
                    
                    {/* Menu Réglages avec sous-menu */}
                    <div className="relative" ref={settingsMenuRef}>
                      <button 
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors"
                      >
                        <span>Réglages</span>
                        <svg className={`h-4 w-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isSettingsOpen && (
                        <div className="bg-gray-50 border-l-2 border-primary-400">
                          <NavLink to="/settings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                            Modifier mon profil
                          </NavLink>
                          <NavLink to="/boosted-listings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                            Mes annonces boostées
                          </NavLink>
                          <button 
                            className="block w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" 
                            onClick={() => { setShowContactModal(true); setIsSettingsOpen(false); }}
                          >
                            Contacter l'équipe Appyna
                          </button>
                          <NavLink to="/terms" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                            Conditions générales
                          </NavLink>
                          <NavLink to="/privacy" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                            Politique de confidentialité
                          </NavLink>
                        </div>
                      )}
                    </div>
                    
                    <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-montserrat transition-colors">
                      <LogoutIcon />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-primary-600 font-montserrat transition-colors text-sm">Connexion</Link>
                <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white px-5 py-2 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm">Inscription</Link>
              </div>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
             <button ref={hamburgerButtonRef} onClick={handleMenuToggle} className="text-gray-600 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>
          </div>
        </div>
      </div>
       {isMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-white/95 backdrop-blur-lg py-4 px-4 space-y-3 border-t border-purple-100">
              <Link to="/create" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg text-sm">
                  <PlusIcon /> Poster une annonce
              </Link>
              {user ? (
                 <>
                  <NavLink to={`/profile/${user.id}`} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors">Mon Profil</NavLink>
                  <NavLink to="/messages" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors">Messagerie</NavLink>
                  <NavLink to="/favorites" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors">Mes favoris</NavLink>
                  
                  {/* Menu Réglages mobile avec sous-menu */}
                  <div>
                    <button 
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                      className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors"
                    >
                      <span>Réglages</span>
                      <svg className={`h-4 w-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isSettingsOpen && (
                      <div className="bg-gray-50 rounded-xl mt-2 border-l-2 border-primary-400">
                        <NavLink to="/settings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                          Modifier mon profil
                        </NavLink>
                        <NavLink to="/boosted-listings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                          Mes annonces boostées
                        </NavLink>
                        <button 
                          className="block w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" 
                          onClick={() => { setShowContactModal(true); setIsMenuOpen(false); setIsSettingsOpen(false); }}
                        >
                          Contacter l'équipe Appyna
                        </button>
                        <NavLink to="/terms" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                          Conditions générales
                        </NavLink>
                        <NavLink to="/privacy" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                          Politique de confidentialité
                        </NavLink>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-montserrat transition-colors">Déconnexion</button>
                 </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2">
                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center w-full px-4 py-2.5 text-gray-600 font-medium bg-gray-100 rounded-xl font-montserrat transition-colors text-sm">Connexion</Link>
                   <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-center bg-gradient-to-r from-primary-600 to-secondary-500 text-white px-4 py-2.5 rounded-xl font-medium hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 shadow-lg text-sm">Inscription</Link>
                </div>
              )}
          </div>
      )}
    </header>

    {/* Modal de contact - en dehors du header pour meilleur positionnement */}
    {showContactModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-poppins">Prendre contact</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 font-montserrat mb-6 text-center text-sm sm:text-base">
              Un membre de l'équipe Appyna vous répondra dans les plus brefs délais.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Email (pré-rempli et non modifiable) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-montserrat"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                  Message
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={6}
                  placeholder="Écrivez votre message..."
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition font-montserrat resize-none"
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-montserrat"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 sm:py-2.5 px-4 sm:px-5 border border-transparent rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
};