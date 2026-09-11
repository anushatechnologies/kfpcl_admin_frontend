import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

const missingFirebaseKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
const hasFirebaseConfig = missingFirebaseKeys.length === 0;

if (!hasFirebaseConfig) {
  console.warn(
    `Firebase is disabled because these environment variables are missing: ${missingFirebaseKeys.join(', ')}`,
  );
}

const firebaseApp = hasFirebaseConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

// Realtime Database — only available when VITE_FIREBASE_DATABASE_URL is set
export const firebaseDb = firebaseApp && firebaseConfig.databaseURL ? getDatabase(firebaseApp) : null;
