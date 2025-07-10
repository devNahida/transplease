import React from 'react';
import { ArrowRight, Clock, Shield, DollarSign, Users, Star } from 'lucide-react';
import { Page } from '../App';
import AdvantageCard from '../components/AdvantageCard';
import TestimonialCard from '../components/TestimonialCard';
import { motion } from 'framer-motion'; // Ajout de framer-motion
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface HomePageProps {
  onNavigate?: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const advantages = [
    {
      icon: Clock,
      title: 'Rapidité',
      description: 'Interventions dans les plus brefs délais, 7j/7'
    },
    {
      icon: DollarSign,
      title: 'Prix transparents',
      description: 'Tarifs clairs sans surprises, devis gratuit'
    },
    {
      icon: Users,
      title: 'Service client',
      description: 'Équipe dédiée à votre écoute'
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Assurance tous risques et matériel professionnel'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      company: 'Particulier',
      content: 'Service impeccable pour mon déménagement. Équipe professionnelle et ponctuelle.',
      rating: 5
    },
    {
      name: 'Jean Martin',
      company: 'Martin & Associés',
      content: 'Transplease gère toutes nos livraisons d\'entreprise avec une fiabilité remarquable.',
      rating: 5
    },
    {
      name: 'Sophie Laurent',
      company: 'Boutique en ligne',
      content: 'Parfait pour mes envois clients. Suivi en temps réel et tarifs compétitifs.',
      rating: 5
    }
  ];

  return (
    <div className="bg-white dark:bg-primary-dark min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-white to-gray-100 dark:from-primary-dark dark:to-secondary-green text-primary-dark dark:text-text-light overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <motion.img
            src="/galery/galery1.jpeg"
            alt="Transport background"
            className="w-full h-full object-cover opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5 }}
          />
        </div>
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Transport et logistique en Île-de-France</h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-text-grey">Livraison, déménagement, envoi de plis - Solutions complètes pour particuliers et professionnels</p>
            <motion.button
              onClick={() => onNavigate && onNavigate('quote')}
              className="bg-accent-gold text-primary-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-green hover:text-text-light transition-colors inline-flex items-center shadow-md transition-transform duration-200 hover:scale-105"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              Demander un devis gratuit
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white dark:bg-secondary-green transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-primary-dark dark:text-text-light mb-4">Nos Services</h2>
            <p className="text-lg text-gray-600 dark:text-text-grey max-w-2xl mx-auto">Des solutions de transport adaptées à tous vos besoins</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Cartes services réarrangées */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-white dark:bg-primary-dark rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow border border-divider-grey flex flex-col h-full transition-colors duration-300 transition-transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                <img src="icon/iconeDemenagement.png" alt="Déménagement" className="w-12 h-12 object-cover rounded" />
              </div>
              <h3 className="text-xl font-semibold text-primary-dark dark:text-text-light mb-3">Déménagement</h3>
              <p className="text-gray-600 dark:text-text-grey mb-4">Service complet de déménagement avec emballage, transport et installation dans votre nouveau logement.</p>
              <motion.button 
                onClick={() => onNavigate && onNavigate('services')}
                className="text-accent-gold font-medium hover:text-text-light inline-flex items-center transition-colors transition-transform hover:scale-105"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >En savoir plus<ArrowRight className="ml-1 h-4 w-4" /></motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white dark:bg-primary-dark rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow border border-divider-grey flex flex-col h-full transition-colors duration-300 transition-transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                <img src="icon/iconePli.png" alt="Envoi de plis" className="w-12 h-12 object-cover rounded" />
              </div>
              <h3 className="text-xl font-semibold text-primary-dark dark:text-text-light mb-3">Envoi de Plis</h3>
              <p className="text-gray-600 dark:text-text-grey mb-4">Transport sécurisé de documents et plis urgents avec suivi en temps réel.</p>
              <motion.button 
                onClick={() => onNavigate && onNavigate('services')}
                className="text-accent-gold font-medium hover:text-text-light inline-flex items-center transition-colors transition-transform hover:scale-105"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >En savoir plus<ArrowRight className="ml-1 h-4 w-4" /></motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-primary-dark rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow border border-divider-grey flex flex-col h-full transition-colors duration-300 transition-transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-accent-gold rounded-lg flex items-center justify-center mb-4">
                <img src="icon/iconeLivraison.png" alt="Livraison" className="w-12 h-12 object-cover rounded" />
              </div>
              <h3 className="text-xl font-semibold text-primary-dark dark:text-text-light mb-3">Livraison Express</h3>
              <p className="text-gray-600 dark:text-text-grey mb-4">Livraisons rapides et sécurisées dans toute l'Île-de-France pour particuliers et entreprises.</p>
              <motion.button 
                onClick={() => onNavigate && onNavigate('services')}
                className="text-accent-gold font-medium hover:text-text-light inline-flex items-center transition-colors transition-transform hover:scale-105"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
              >En savoir plus<ArrowRight className="ml-1 h-4 w-4" /></motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-primary-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-primary-dark dark:text-text-light mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-lg text-gray-600 dark:text-text-grey max-w-2xl mx-auto">Notre expertise et notre engagement font la différence</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="transition-transform hover:scale-105"
              >
                <AdvantageCard {...advantage} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mes partenaires */}
      <section className="py-20 bg-white dark:bg-secondary-green transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-dark dark:text-text-light mb-4">Mes partenaires</h2>
            <p className="text-lg text-gray-600 dark:text-text-grey max-w-2xl mx-auto">Ils nous font confiance</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
            <img src="/partenaire/Partenaire1.png" alt="Partenaire 1" className="h-24 object-contain grayscale hover:grayscale-0 transition duration-300" />
            <img src="/partenaire/Partenaire2.png" alt="Partenaire 2" className="h-24 object-contain grayscale hover:grayscale-0 transition duration-300" />
            <img src="/partenaire/Partenaire3.png" alt="Partenaire 3" className="h-24 object-contain grayscale hover:grayscale-0 transition duration-300" />
            <img src="/partenaire/Partenaire4.png" alt="Partenaire 4" className="h-24 object-contain grayscale hover:grayscale-0 transition duration-300" />
            <img src="/partenaire/Partenaire5.png" alt="Partenaire 5" className="h-24 object-contain grayscale hover:grayscale-0 transition duration-300" />
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-20 bg-gray-50 dark:bg-primary-dark transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-dark dark:text-text-light mb-4">Galerie</h2>
            <p className="text-lg text-gray-600 dark:text-text-grey max-w-2xl mx-auto">Découvrez nos réalisations et moments forts</p>
          </div>
          <div className="bg-white/80 dark:bg-primary-dark rounded-xl shadow-lg p-2 md:p-6 max-w-2xl md:max-w-4xl mx-auto">
            <Carousel
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={4000}
              className="rounded-lg"
            >
              <div>
                <img src="/galery/galery1.jpeg" alt="Galerie 1" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery2.jpeg" alt="Galerie 2" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery3.jpeg" alt="Galerie 3" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery4.jpeg" alt="Galerie 4" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery5.jpeg" alt="Galerie 5" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery6.jpeg" alt="Galerie 6" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery7.jpeg" alt="Galerie 7" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery8.jpeg" alt="Galerie 8" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
              <div>
                <img src="/galery/galery9.jpeg" alt="Galerie 9" className="object-contain rounded-lg w-full h-72 md:h-96 bg-white dark:bg-primary-dark" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-primary-dark text-primary-dark dark:text-text-light border-t border-divider-grey transition-colors duration-300">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-6">Prêt à confier vos transports à des professionnels ?</h2>
          <p className="text-xl text-gray-600 dark:text-text-grey mb-10">Obtenez un devis gratuit et personnalisé en quelques clics</p>
          <motion.button
            onClick={() => onNavigate && onNavigate('quote')}
            className="bg-accent-gold text-primary-dark px-10 py-4 rounded-lg font-semibold text-lg hover:bg-secondary-green hover:text-text-light transition-colors inline-flex items-center shadow-md transition-transform duration-200 hover:scale-105"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            Demander un devis maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;