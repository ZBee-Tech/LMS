 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: "AIzaSyBrgYKHrqEW29DwqK5UVcRktrZe3OFxpFk",
  authDomain: "e-conges.firebaseapp.com",
  projectId: "e-conges",
  storageBucket: "e-conges.appspot.com",
  messagingSenderId: "201935697599",
  appId: "1:201935697599:web:6787b44ed48675873db80a",
  measurementId: "G-FSGEMGNRDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);