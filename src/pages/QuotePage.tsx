import React, { useState } from 'react';
import { Page } from '../App';
import QuoteForm from '../components/QuoteForm';

interface QuotePageProps {
  onNavigate?: (page: Page) => void;
}

const QuotePage: React.FC<QuotePageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-white to-gray-100 dark:from-primary-dark dark:to-secondary-green text-primary-dark dark:text-text-light py-20 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Demander un devis gratuit</h1>
          <p className="text-xl text-gray-600 dark:text-text-grey">Obtenez votre devis personnalisé en quelques minutes</p>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20 bg-white dark:bg-secondary-green transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuoteForm onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  );
};

export default QuotePage;