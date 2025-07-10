import React from 'react';
import { Page } from '../App';
import ServiceCard from '../components/ServiceCard';

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const services = [
    {
      title: 'Livraison Express',
      description: 'Service de livraison rapide et fiable dans toute l\'Île-de-France. Idéal pour vos colis urgents, courses et achats e-commerce.',
      features: [
        'Livraison en moins de 2h',
        'Suivi en temps réel',
        'Prise en charge 7j/7',
        'Assurance tous risques'
      ],
      image: 'galery/galery2.jpeg',
      price: 'À partir de 15€'
    },
    {
      title: 'Déménagement Complet',
      description: 'Service complet de déménagement avec notre équipe de professionnels. Emballage, transport et installation dans votre nouveau logement.',
      features: [
        'Équipe expérimentée',
        'Matériel professionnel fourni',
        'Emballage et déballage',
        'Montage/démontage mobilier'
      ],
      image: 'galery/galery6.jpeg',
      price: 'Devis personnalisé'
    },
    {
      title: 'Envoi de Plis Sécurisé',
      description: 'Transport sécurisé de documents confidentiels et plis urgents pour entreprises et particuliers.',
      features: [
        'Confidentialité garantie',
        'Accusé de réception',
        'Livraison en main propre',
        'Traçabilité complète'
      ],
      image: 'galery/galery10.jpg',
      price: 'À partir de 8€'
    }
  ];

  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-white to-gray-100 dark:from-primary-dark dark:to-secondary-green text-primary-dark dark:text-text-light py-24 md:py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight">Nos Services</h1>
            <p className="text-2xl md:text-3xl text-gray-600 dark:text-text-grey max-w-3xl mx-auto font-light mb-4">Des solutions de transport complètes et professionnelles adaptées à tous vos besoins en Île-de-France</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-secondary-green transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {services.map((service, index) => (
              <div className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl shadow-lg rounded-2xl bg-white dark:bg-primary-dark border border-divider-grey" key={index}>
                <ServiceCard {...service} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-primary-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-text-light mb-6">
            Besoin d'un service personnalisé ?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-text-grey mb-10">
            Contactez-nous pour discuter de vos besoins spécifiques. Nous adaptons nos services à vos contraintes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => onNavigate('quote')}
              className="bg-accent-gold text-primary-dark px-10 py-4 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors text-lg md:text-xl shadow-md min-w-[220px]"
            >
              Demander un devis
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="border border-accent-gold text-accent-gold px-10 py-4 rounded-lg font-semibold hover:bg-accent-gold hover:text-primary-dark transition-colors text-lg md:text-xl shadow-md min-w-[220px]"
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;