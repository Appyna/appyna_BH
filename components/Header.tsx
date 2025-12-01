import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Logo } from './icons/Logo';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import { ContactModal } from './ContactModal';
import { useMessagesBadge } from '../hooks/useMessagesBadge';

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
  const { count: messageCount } = useMessagesBadge();

  // Refs pour détecter les clics en dehors
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Header toujours visible (pas de hide au scroll pour éviter les problèmes sur iPhone)
  // Le code de gestion du scroll a été retiré pour une meilleure expérience mobile

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
    <header className={`bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 w-full z-40 border-b border-purple-100`} style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
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
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="relative flex items-center space-x-2 hover:bg-purple-50 p-2 rounded-xl transition-colors">
                   {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-200" />
                   ) : (
                     <div className="h-10 w-10 rounded-full bg-gray-200 ring-2 ring-purple-200 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                       </svg>
                     </div>
                   )}
                   {messageCount > 0 && (
                     <span className="absolute top-1 right-1 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                       {messageCount}
                     </span>
                   )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 ring-1 ring-black ring-opacity-5 border border-purple-100">
                    <div className="px-4 py-3 border-b border-purple-100">
                      <p 
                        className="text-sm font-semibold text-gray-800 font-poppins overflow-hidden text-ellipsis whitespace-nowrap" 
                        title={user.name}
                      >
                        {user.name}
                      </p>
                    </div>
                    <NavLink to={`/profile/${user.id}`} className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => setIsProfileOpen(false)}>Mon profil</NavLink>
                    <NavLink to="/messages" className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => setIsProfileOpen(false)}>
                      <span>Mes messages</span>
                      {messageCount > 0 && (
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {messageCount}
                        </span>
                      )}
                    </NavLink>
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
                          <NavLink to="/settings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { sessionStorage.setItem('current_user_id', user.id); setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                            Modifier mon profil
                          </NavLink>
                          <button 
                            className="block w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" 
                            onClick={() => { setShowContactModal(true); setIsSettingsOpen(false); }}
                          >
                            Contacter l'équipe Appyna
                          </button>
                          {/* Bouton Admin Dashboard - Visible uniquement pour l'admin */}
                          {user.id === '91c84b9e-376e-45c1-84f7-329476e9e5eb' && (
                            <NavLink to="/admin/dashboard" className="block px-6 py-2.5 text-sm text-primary-600 font-semibold hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }}>
                              Dashboard
                            </NavLink>
                          )}
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
             <button ref={hamburgerButtonRef} onClick={handleMenuToggle} className="relative text-gray-600 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                {user && messageCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                    {messageCount}
                  </span>
                )}
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
                  <NavLink to={`/profile/${user.id}`} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors">Mon profil</NavLink>
                  <NavLink to="/messages" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-montserrat transition-colors">
                    <span>Mes messages</span>
                    {messageCount > 0 && (
                      <span className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {messageCount}
                      </span>
                    )}
                  </NavLink>
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
                        <NavLink to="/settings" className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { sessionStorage.setItem('current_user_id', user.id); setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                          Modifier mon profil
                        </NavLink>
                        <button 
                          className="block w-full text-left px-6 py-2.5 text-sm text-gray-600 hover:bg-purple-50 font-montserrat transition-colors" 
                          onClick={() => { setShowContactModal(true); setIsMenuOpen(false); setIsSettingsOpen(false); }}
                        >
                          Contacter l'équipe Appyna
                        </button>
                        {/* Bouton Admin Dashboard - Visible uniquement pour l'admin */}
                        {user && user.id === '91c84b9e-376e-45c1-84f7-329476e9e5eb' && (
                          <NavLink to="/admin/dashboard" className="block px-6 py-2.5 text-sm text-primary-600 font-semibold hover:bg-purple-50 font-montserrat transition-colors" onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(false); }}>
                            Dashboard
                          </NavLink>
                        )}
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

    {/* Modal de contact */}
    <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </>
  );
};