// Remplace les valeurs ci-dessous par celles de ton projet Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCtQAczEcnS0G5X43t0ScMF7Z8bp3lE2Do',
  authDomain: 'transplease-93.firebaseapp.com',
  projectId: 'transplease-93',
  storageBucket: 'transplease-93.firebasestorage.app',
  messagingSenderId: '1020140974871',
  appId: '1:1020140974871:web:2a70fba50ef13f0d45fd52',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 