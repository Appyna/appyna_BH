
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './icons/Logo';
import { ContactModal } from './ContactModal';

export const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="text-gray-500 mt-4 text-sm">
              La marketplace francophone en Israël. Simple, fluide et élégante.
            </p>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold tracking-wide">Appyna</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="text-gray-500 hover:text-primary-600">À propos</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary-600">Comment ça marche ?</Link></li>
              <li>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold tracking-wide">Légal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/terms" className="text-gray-500 hover:text-primary-600">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-primary-600">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-primary-600">Politique de cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} Appyna. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
    </>
  );
};
