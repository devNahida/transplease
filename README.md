# Transplease

## Présentation

Transplease est une application front-end moderne développée avec React, TypeScript, Vite et Tailwind CSS.

---

## Prérequis

- **Node.js** (version 18 ou supérieure recommandée)
- **npm** (installé automatiquement avec Node.js)
- Un terminal (ex : Terminal sur Mac, CMD/PowerShell sur Windows)
- (Optionnel) Un compte GitHub pour cloner le projet

---

## Intégration Firebase et EmailJS

### Firebase
Firebase est utilisé dans ce projet pour la gestion de l’authentification, la base de données en temps réel ou le stockage (selon la configuration de votre projet).

**Configuration :**
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/).
2. Ajoutez une application web à votre projet Firebase.
3. Récupérez la configuration Firebase (apiKey, authDomain, projectId, etc.).
4. Remplissez le fichier `src/firebase.ts` avec vos informations de configuration :
   ```ts
   // Exemple de src/firebase.ts
   import { initializeApp } from 'firebase/app';
   const firebaseConfig = {
     apiKey: 'VOTRE_API_KEY',
     authDomain: 'VOTRE_AUTH_DOMAIN',
     projectId: 'VOTRE_PROJECT_ID',
     // ...
   };
   export const app = initializeApp(firebaseConfig);
   ```
5. Activez les services nécessaires (Authentication, Firestore, etc.) dans la console Firebase.

### EmailJS
EmailJS permet d’envoyer des emails directement depuis le front-end, sans backend.

**Configuration :**
1. Créez un compte sur [EmailJS](https://www.emailjs.com/).
2. Ajoutez un service email (Gmail, Outlook, etc.) et créez un template d’email.
3. Récupérez votre `User ID`, `Service ID` et `Template ID` depuis le dashboard EmailJS.
4. Installez la librairie EmailJS dans le projet :
   ```bash
   npm install @emailjs/browser
   ```
5. Utilisez EmailJS dans votre code, par exemple dans un formulaire de contact :
   ```ts
   import emailjs from '@emailjs/browser';
   emailjs.send('VOTRE_SERVICE_ID', 'VOTRE_TEMPLATE_ID', params, 'VOTRE_USER_ID');
   ```
6. Pour plus de détails, consultez la [documentation EmailJS](https://www.emailjs.com/docs/).

---

## Installation et lancement en local

1. **Cloner le dépôt**
   Si vous avez Git installé, ouvrez votre terminal et tapez :
   ```bash
   git clone https://github.com/ton-utilisateur/ton-repo.git
   cd ton-repo
   ```
   Sinon, téléchargez le projet en ZIP depuis GitHub et décompressez-le, puis ouvrez un terminal dans le dossier du projet.

2. **Installer les dépendances**
   ```bash
   npm install
   ```
   Cette commande télécharge toutes les librairies nécessaires au fonctionnement du projet.

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Après quelques secondes, un message s'affiche avec une URL (généralement http://localhost:5173). Ouvrez cette URL dans votre navigateur pour voir l'application.

4. **Arrêter le serveur**
   Pour arrêter le serveur, retournez dans le terminal et faites `Ctrl + C`.

---

## Stack technique

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [EmailJS](https://www.emailjs.com/)

---

## Organisation recommandée

- Les images statiques sont dans `public/images/`, les icônes dans `public/icons/`, les partenaires dans `public/partners/`.
- Les composants réutilisables sont dans `src/components/`.
- Les pages sont dans `src/pages/`.
- Les hooks personnalisés dans `src/hooks/`.
- Les types globaux dans `src/types/`.
- Les styles dans `src/styles/`.

---

## Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes modifications (`git commit -am 'Ajout de ma feature'`)
4. Push la branche (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request

---

N’hésite pas à adapter ce README# transplease
