import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVsTTc53OT4TqK-Pez6QneYCT_KzOH-rY",
  authDomain: "econges-9e1c2.firebaseapp.com",
  projectId: "econges-9e1c2",
  storageBucket: "econges-9e1c2.appspot.com",
  messagingSenderId: "145024754425",
  appId: "1:145024754425:web:98cf607b177742f0f57828",
  measurementId: "G-J84P8M3GHB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
