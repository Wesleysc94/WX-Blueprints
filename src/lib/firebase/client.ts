import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const databaseId =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || "(default)";

export const hasFirebaseClientConfig = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (cachedApp) return cachedApp;
  if (!hasFirebaseClientConfig()) {
    throw new Error("Firebase client não configurado. Preencha NEXT_PUBLIC_FIREBASE_* em .env.local.");
  }
  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
};

export const getFirebaseAuth = (): Auth => {
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(getFirebaseApp());
  return cachedAuth;
};

export const getFirebaseDb = (): Firestore => {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  if (databaseId && databaseId !== "(default)") {
    cachedDb = initializeFirestore(app, {}, databaseId);
  } else {
    cachedDb = getFirestore(app);
  }
  return cachedDb;
};

export const getFirebaseStorage = (): FirebaseStorage => {
  if (cachedStorage) return cachedStorage;
  cachedStorage = getStorage(getFirebaseApp());
  return cachedStorage;
};
