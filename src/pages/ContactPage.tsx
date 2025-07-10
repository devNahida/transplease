import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Page } from '../App';
import ContactForm from '../components/ContactForm';

interface ContactPageProps {
  onNavigate?: (page: Page) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-white to-gray-100 dark:from-primary-dark dark:to-secondary-green text-primary-dark dark:text-text-light py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
          <p className="text-xl text-gray-600 dark:text-text-grey">Notre équipe est à votre écoute pour répondre à toutes vos questions</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white dark:bg-secondary-green transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-8">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-text-light mb-1">Téléphone</h3>
                    <p className="text-gray-600 dark:text-text-grey mb-2">01 48 61 15 64</p>
                    <a 
                      href="tel:0123456789"
                      className="inline-flex items-center text-accent-gold hover:text-primary-dark dark:hover:text-text-light font-medium transition-colors"
                    >
                      Appeler maintenant
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-text-light mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-text-grey mb-2">contact@transplease.fr</p>
                    <a 
                      href="mailto:contact@transplease.fr"
                      className="inline-flex items-center text-accent-gold hover:text-primary-dark dark:hover:text-text-light font-medium transition-colors"
                    >
                      Envoyer un email
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-text-light mb-1">Zone d'intervention</h3>
                    <p className="text-gray-600 dark:text-text-grey">
                      Île-de-France<br />
                      Paris et toute la banlieue
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark dark:text-text-light mb-1">Horaires</h3>
                    <div className="text-gray-600 dark:text-text-grey">
                      <p>Lundi - Vendredi : 8h - 19h</p>
                      <p>Samedi : 9h - 17h</p>
                      <p>Dimanche : Sur demande</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8">
                <h3 className="font-semibold text-primary-dark dark:text-text-light mb-4">Notre zone d'intervention</h3>
                <div className="bg-gray-100 dark:bg-primary-dark rounded-lg h-64 flex items-center justify-center border border-divider-grey transition-colors duration-300">
                  <div className="text-center text-gray-600 dark:text-text-grey">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-accent-gold" />
                    <p>Carte de l'Île-de-France</p>
                    <p className="text-sm">Zone d'intervention Transplease</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-primary-dark text-primary-dark dark:text-text-light border-t border-divider-grey transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Besoin d'un transport immédiat ?</h2>
          <p className="text-lg text-gray-600 dark:text-text-grey mb-10">Pour les demandes urgentes, contactez-nous directement par téléphone</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="tel:0123456789"
              className="bg-accent-gold text-primary-dark px-10 py-4 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors inline-flex items-center justify-center shadow-md"
            >
              <Phone className="mr-2 h-5 w-5" />
              Appeler maintenant
            </a>
            <button 
              onClick={() => onNavigate && onNavigate('quote')}
              className="border border-accent-gold text-accent-gold px-10 py-4 rounded-lg font-semibold hover:bg-accent-gold hover:text-primary-dark transition-colors shadow-md"
            >
              Devis en ligne
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;