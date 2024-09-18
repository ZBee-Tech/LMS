 import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  
import { getFirestore } from "firebase/firestore";  
import { getDatabase } from "firebase/database";   

const firebaseConfig = {
  apiKey: "AIzaSyBrgYKHrqEW29DwqK5UVcRktrZe3OFxpFk",
  authDomain: "e-conges.firebaseapp.com",
  projectId: "e-conges",
  databaseURL: "https://e-conges-default-rtdb.firebaseio.com/",  
  storageBucket: "e-conges.appspot.com",
  messagingSenderId: "201935697599",
  appId: "1:201935697599:web:6787b44ed48675873db80a",
  measurementId: "G-FSGEMGNRDB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  
const db = getFirestore(app);   
const realtimeDb = getDatabase(app);   

export { auth, db, realtimeDb };
