import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Vérifier si l'email est dans la collection admins
    const q = query(collection(db, 'admins'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) {
      setError("Votre email n'a pas été autorisé par le superadmin.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Compte créé ! Vous pouvez vous connecter.');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    }
  };

  return (
    <form onSubmit={handleRegister} className="bg-secondary-green rounded-xl shadow-lg p-8 max-w-md mx-auto space-y-6 border border-divider-grey">
      <h2 className="text-2xl font-bold text-text-light mb-6">Inscription administrateur</h2>
      <div>
        <label className="block text-sm font-medium text-text-light mb-2">Email</label>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-primary-dark text-text-light placeholder-text-grey"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-light mb-2">Mot de passe</label>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-divider-grey rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-primary-dark text-text-light placeholder-text-grey"
          required
        />
      </div>
      <button type="submit" className="w-full bg-accent-gold text-primary-dark py-3 px-6 rounded-lg font-semibold hover:bg-secondary-green hover:text-text-light transition-colors">
        S'inscrire
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {success && <div className="text-green-400 mt-2">{success}</div>}
    </form>
  );
} 