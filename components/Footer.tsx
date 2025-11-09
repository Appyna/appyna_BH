
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './icons/Logo';

export const Footer: React.FC = () => {
  return (
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
              <li><Link to="#" className="text-gray-500 hover:text-primary-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold tracking-wide">Légal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="#" className="text-gray-500 hover:text-primary-600">Conditions d'utilisation</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary-600">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-800 font-semibold tracking-wide">Suivez-nous</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">&copy; {new Date().getFullYear()} Appyna. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
