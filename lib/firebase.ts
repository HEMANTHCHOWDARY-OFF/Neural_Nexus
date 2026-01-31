import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASnvWpKa15ceMiQOnLne-p26D48Q0OWKo",
  authDomain: "neuralnexus-3df8e.firebaseapp.com",
  projectId: "neuralnexus-3df8e",
  storageBucket: "neuralnexus-3df8e.firebasestorage.app",
  messagingSenderId: "1009999136995",
  appId: "1:1009999136995:web:3a02d6fb70be07bc099dd6",
  measurementId: "G-QGXPF51FH2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
