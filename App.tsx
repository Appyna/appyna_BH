import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BoostHistoryPage } from './pages/BoostHistoryPage';
import { BoostSuccessPage } from './pages/BoostSuccessPage';
import { BoostCancelPage } from './pages/BoostCancelPage';
import { MessagesPage } from './pages/MessagesPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { EmailConfirmationPage } from './pages/EmailConfirmationPage';
import { EmailConfirmationRedirectPage } from './pages/EmailConfirmationRedirectPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import AdminModerationPage from './pages/AdminModerationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AdminSupportPage } from './pages/AdminSupportPage';
import { MenuProvider } from './contexts/MenuContext';
import { AuthProvider } from './contexts/AuthContext';

// Simple scroll to top manager (restauration gérée par HomePage via index)
const ScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Pour les pages détail et autres : scroll to top
    // La restauration pour HomePage est gérée directement dans le composant via l'index
    if (!location.pathname.startsWith('/listing/')) {
      const savedIndex = sessionStorage.getItem('listing_index');
      const returnPath = sessionStorage.getItem('return_path');
      
      // Ne pas scroll to top si on restaure la HomePage
      if (savedIndex && returnPath && (location.pathname + location.search) === returnPath) {
        console.log('📍 ScrollManager: Restauration gérée par HomePage (index-based)');
        return;
      }
    }
    
    // Scroll to top pour toutes les autres navigations
    window.scrollTo(0, 0);
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
          <Routes>
            {/* Route sans Layout (pas de Header/Footer) */}
            <Route path="/auth/confirm" element={<EmailConfirmationRedirectPage />} />
            
            {/* Routes avec Layout */}
            <Route path="/*" element={
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
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/messages/:conversationId" element={<MessagesPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/cookies" element={<CookiePolicyPage />} />
                  <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/moderation" element={<AdminModerationPage />} />
                  <Route path="/admin/support" element={<AdminSupportPage />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </MenuProvider>
    </AuthProvider>
  );
};

export default App;
