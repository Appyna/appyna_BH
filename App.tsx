import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ProfilePage } from './pages/ProfilePage';
import { MessagesPage } from './pages/MessagesPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { SettingsPage } from './pages/SettingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BoostHistoryPage } from './pages/BoostHistoryPage';
import { BoostSuccessPage } from './pages/BoostSuccessPage';
import { BoostCancelPage } from './pages/BoostCancelPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { EmailConfirmationPage } from './pages/EmailConfirmationPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import AdminModerationPage from './pages/AdminModerationPage';
import { MenuProvider } from './contexts/MenuContext';
import { AuthProvider } from './contexts/AuthContext';

// A component to handle scroll position management
const ScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Vérifier si on doit restaurer la position de scroll
    const savedPosition = sessionStorage.getItem('scroll_position');
    const returnPath = sessionStorage.getItem('return_path');
    
    console.log('📍 ScrollManager:', {
      currentPath: location.pathname + location.search,
      returnPath,
      savedPosition,
      match: (location.pathname + location.search) === returnPath
    });
    
    if (savedPosition && returnPath && (location.pathname + location.search) === returnPath) {
      // Restaurer la position de scroll avec délai pour laisser la page se charger
      console.log('✅ Restauration scroll vers:', savedPosition);
      
      const targetPosition = parseInt(savedPosition);
      
      // Utiliser requestAnimationFrame pour attendre que le DOM soit prêt
      // Puis vérifier plusieurs fois que le contenu est chargé
      const restoreScroll = (attempts = 0) => {
        const bodyHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = bodyHeight - windowHeight;
        const canScroll = maxScroll >= targetPosition;
        
        console.log(`📏 Tentative ${attempts + 1}: maxScroll=${maxScroll}, target=${targetPosition}, canScroll=${canScroll}`);
        
        if (canScroll) {
          // Le contenu est assez grand, on peut scroller
          window.scrollTo({
            top: targetPosition,
            behavior: 'instant' // Scroll instantané
          });
          console.log('✅ Scroll restauré à:', window.scrollY);
          sessionStorage.removeItem('scroll_position');
        } else if (attempts < 10) {
          // Réessayer après un court délai (max 10 tentatives = 500ms)
          setTimeout(() => restoreScroll(attempts + 1), 50);
        } else {
          // Dernière tentative : scroller au maximum possible
          window.scrollTo({
            top: Math.min(targetPosition, maxScroll),
            behavior: 'instant'
          });
          console.log('⚠️ Scroll partiel restauré à:', window.scrollY, '(target:', targetPosition, ')');
          sessionStorage.removeItem('scroll_position');
        }
      };
      
      // Utiliser requestAnimationFrame pour être sûr que le DOM est monté
      requestAnimationFrame(() => restoreScroll());
    } else if (location.pathname.startsWith('/listing/')) {
      // Page détail : scroll to top
      window.scrollTo(0, 0);
    } else if (!savedPosition) {
      // Nouvelle page : scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

// A component to conditionally render Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MenuProvider>
        <Router>
          <ScrollManager />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listing/:id" element={<ListingDetailPage />} />
              <Route path="/create" element={<CreateListingPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/boost-history" element={<BoostHistoryPage />} />
              <Route path="/boost/success" element={<BoostSuccessPage />} />
              <Route path="/boost/cancel" element={<BoostCancelPage />} />
              <Route path="/admin/moderation" element={<AdminModerationPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:conversationId" element={<MessagesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </Layout>
        </Router>
      </MenuProvider>
    </AuthProvider>
  );
};

export default App;
