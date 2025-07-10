import React, { useState } from 'react';
import { Page } from '../App';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const LoginForm: React.FC<{ onNavigate?: (page: Page) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Vérifie que l'email est dans la collection admins
    const q = query(collection(db, 'admins'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) {
      setError('Seuls les administrateurs autorisés peuvent se connecter.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Connexion réussie !');
      setEmail('');
      setPassword('');
      if (onNavigate) onNavigate('admin');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary-green rounded-xl shadow-lg p-8 max-w-md mx-auto mt-8 space-y-6 border border-divider-grey">
      <h2 className="text-2xl font-bold text-text-light mb-6">Connexion</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-text-light mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-primary-dark text-text-light placeholder-text-grey"
          placeholder="Votre email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-light mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-primary-dark text-text-light placeholder-text-grey"
          placeholder="Votre mot de passe"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent-gold text-primary-dark py-3 px-6 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors"
      >
        Se connecter
      </button>
      <div className="text-center mt-4">
        <span className="text-text-grey">Pas de compte ? </span>
        <button type="button" className="text-accent-gold underline hover:text-text-light transition-colors" onClick={() => onNavigate && onNavigate('register')}>
          S'inscrire
        </button>
      </div>
    </form>
  );
};

export default LoginForm; 