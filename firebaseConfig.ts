import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAB2334MjJAY1ZK_qOoZnUXR7IUbsdE3ao",
  authDomain: "snapboard-eafce.firebaseapp.com",
  projectId: "snapboard-eafce",
  storageBucket: "snapboard-eafce.firebasestorage.app",
  messagingSenderId: "208272221014",
  appId: "1:208272221014:web:eab5c3eadb3eb36f1f6cf7",
  measurementId: "G-8WQD7X45D3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db };
