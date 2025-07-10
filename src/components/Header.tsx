import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Page } from '../App';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isModalOpen?: boolean; // Ajout prop pour gérer le z-index
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isModalOpen = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const menuItems = [
    { id: 'home' as Page, label: 'Accueil' },
    { id: 'services' as Page, label: 'Nos Services' },
    { id: 'quote' as Page, label: 'Demander un devis' },
    { id: 'contact' as Page, label: 'Contact' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && u.email) {
        const q = query(collection(db, 'admins'), where('email', '==', u.email));
        const snap = await getDocs(q);
        setIsAdmin(!snap.empty);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className={`bg-secondary-green shadow-lg sticky top-0 border-b border-divider-grey ${isModalOpen ? 'z-10' : 'z-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <img src="/logo-transplease-blanc.svg" alt="Logo Transplease" className="h-12 mr-3" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-primary-dark bg-accent-gold'
                    : 'text-text-light hover:text-accent-gold hover:bg-primary-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => handleNavigation('admin')}
                className="ml-4 px-6 py-2 bg-accent-gold text-primary-dark rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors"
              >
                Dashboard
              </button>
            )}
            {user && (
              <button
                onClick={async () => { await signOut(auth); }}
                className="ml-4 px-4 py-2 bg-primary-dark text-text-light rounded-lg font-semibold hover:bg-accent-gold hover:text-primary-dark transition-colors"
              >
                Déconnexion
              </button>
            )}
            <ThemeSwitcher />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-text-light hover:text-accent-gold hover:bg-primary-dark transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-divider-grey">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-primary-dark bg-accent-gold'
                    : 'text-text-light hover:text-accent-gold hover:bg-primary-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => handleNavigation('admin')}
                className="mt-3 w-full px-6 py-3 bg-accent-gold text-primary-dark rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors"
              >
                Dashboard
              </button>
            )}
            {user && (
              <button
                onClick={async () => { await signOut(auth); setIsMenuOpen(false); }}
                className="mt-3 w-full px-4 py-3 bg-primary-dark text-text-light rounded-lg font-semibold hover:bg-accent-gold hover:text-primary-dark transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;