import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";
import Constants from "expo-constants";

const extra = (Constants.expoConfig as any).extra;

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
  measurementId: extra.FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db };

export const storage = getStorage(app);
