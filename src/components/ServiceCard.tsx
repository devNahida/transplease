import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Page } from '../App';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  price: string;
  onNavigate: (page: Page) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  features, 
  image, 
  price, 
  onNavigate 
}) => {
  return (
    <div className="bg-white dark:bg-primary-dark rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border border-divider-grey p-0 flex flex-col h-full transition-colors duration-300">
      <div className="h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-10 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-text-grey mb-8">{description}</p>
        
        <div className="mb-8">
          <h4 className="font-semibold text-primary-dark dark:text-text-light mb-4">Inclus dans ce service :</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-accent-gold mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-text-grey">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Tarif supprimé ici */}
          <button 
            onClick={() => onNavigate('quote')}
            className="bg-accent-gold text-primary-dark px-8 py-3 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors inline-flex items-center text-lg shadow-md"
          >
            Devis gratuit
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;