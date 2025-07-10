import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: new Date()
      });
    alert('Message envoyé avec succès ! Nous vous répondrons rapidement.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    } catch (err) {
      alert('Erreur lors de l\'envoi du message.');
    }
  };

  return (
    <div className="bg-white dark:bg-primary-dark rounded-2xl shadow-xl p-10 border border-divider-grey transition-colors duration-300">
      <h2 className="text-2xl font-bold text-primary-dark dark:text-text-light mb-8">Envoyez-nous un message</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-text-light mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Nom complet
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-100 dark:bg-secondary-green text-primary-dark dark:text-text-light placeholder-gray-400 dark:placeholder-text-grey transition-colors duration-300"
            placeholder="Votre nom et prénom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-dark dark:text-text-light mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-100 dark:bg-secondary-green text-primary-dark dark:text-text-light placeholder-gray-400 dark:placeholder-text-grey transition-colors duration-300"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark dark:text-text-light mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-100 dark:bg-secondary-green text-primary-dark dark:text-text-light placeholder-gray-400 dark:placeholder-text-grey transition-colors duration-300"
              placeholder="Facultatif"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-text-light mb-2">Sujet</label>
          <select
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            required
            className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-100 dark:bg-secondary-green text-primary-dark dark:text-text-light transition-colors duration-300"
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="quote">Demande de devis</option>
            <option value="info">Demande d'information</option>
            <option value="complaint">Réclamation</option>
            <option value="partnership">Partenariat</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-text-light mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-100 dark:bg-secondary-green text-primary-dark dark:text-text-light placeholder-gray-400 dark:placeholder-text-grey transition-colors duration-300"
            placeholder="Décrivez votre demande en détail..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent-gold text-primary-dark py-3 px-6 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors inline-flex items-center justify-center shadow-md"
        >
          <Send className="mr-2 h-5 w-5" />
          Envoyer le message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;