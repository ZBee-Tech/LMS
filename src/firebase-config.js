import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvDQoCkrHpO3208Cl29lQR0B1rgA9Q-GY",
  authDomain: "e-conges-31d17.firebaseapp.com",
  projectId: "e-conges-31d17",
  storageBucket: "e-conges-31d17.appspot.com",
  messagingSenderId: "583574217497",
  appId: "1:583574217497:web:1046785db0d76df5159b88"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
