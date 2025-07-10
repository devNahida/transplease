import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import QuotePage from './pages/QuotePage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LegalPage from './pages/LegalPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuperAdminPage from './pages/SuperAdminPage';

export type Page = 'home' | 'services' | 'quote' | 'contact' | 'admin' | 'legal' | 'login' | 'register' | 'superadmin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAdminModal, setShowAdminModal] = useState(false); // Pour la gestion du z-index de la navbar

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'services':
        return <ServicesPage onNavigate={setCurrentPage} />;
      case 'quote':
        return <QuotePage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} setShowAdminModal={setShowAdminModal} />;
      case 'legal':
        return <LegalPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'superadmin':
        return <SuperAdminPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} isModalOpen={currentPage === 'admin' && showAdminModal} />
      <main>
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;