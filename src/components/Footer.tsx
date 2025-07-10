import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Page } from '../App';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-primary-dark text-primary-dark dark:text-text-light border-t border-divider-grey transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo-transplease-noir.svg" alt="Logo Transplease" className="h-10 mr-3 block dark:hidden" />
              <img src="/logo-transplease-blanc.svg" alt="Logo Transplease" className="h-10 mr-3 hidden dark:block" />
              <span className="text-xl font-bold text-primary-dark dark:text-text-light">Transplease</span>
            </div>
            <p className="text-gray-600 dark:text-text-grey mb-4">
              Votre partenaire de confiance pour tous vos besoins de transport en Île-de-France. 
              Livraison, déménagement, envoi de plis - nous vous accompagnons avec professionnalisme.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-accent-gold mr-2" />
                <span className="text-primary-dark dark:text-text-light">01 48 61 15 64</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent-gold mr-2" />
                <span className="text-primary-dark dark:text-text-light">contact@transplease.fr</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-accent-gold mr-2" />
                <span className="text-primary-dark dark:text-text-light">Paris, Île-de-France</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-dark dark:text-text-light">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  Nos Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('quote')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  Demander un devis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-dark dark:text-text-light">Légal</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('legal')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('legal')}
                  className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors"
                >
                  RGPD
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-text-grey hover:text-accent-gold transition-colors">
                  Conditions générales
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider-grey mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-text-grey">
            © 2025 Transplease. Tous droits réservés.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-gray-600 dark:text-text-grey hover:text-accent-gold underline mt-2 block transition-colors"
            style={{ opacity: 0.7 }}
          >
            Accès admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;