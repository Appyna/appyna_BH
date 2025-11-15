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
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { EmailConfirmationPage } from './pages/EmailConfirmationPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { MenuProvider } from './contexts/MenuContext';
import { AuthProvider } from './contexts/AuthContext';

// A component to handle scroll position management
const ScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Vérifier si on doit restaurer la position de scroll
    const savedPosition = sessionStorage.getItem('scroll_position');
    const returnPath = sessionStorage.getItem('return_path');
    
    if (savedPosition && returnPath && (location.pathname + location.search) === returnPath) {
      // Restaurer la position de scroll
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        // Nettoyer après restauration
        sessionStorage.removeItem('scroll_position');
      }, 0);
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
