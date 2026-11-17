import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase Web configuration for the Qazaq Olymp project.
// These values identify the web app; authorization is enforced by Firebase Security Rules.
const firebaseConfig = {
  apiKey: 'AIzaSyBIArzgKiLYV7_MPXj62dCdJBNXztGxJqo',
  authDomain: 'qazaq-olymp.firebaseapp.com',
  projectId: 'qazaq-olymp',
  storageBucket: 'qazaq-olymp.firebasestorage.app',
  messagingSenderId: '608779247695',
  appId: '1:608779247695:web:3de52f3a91b14894044a3a',
  measurementId: 'G-DDNGWQ16R1',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const isFirebaseConfigured = true
