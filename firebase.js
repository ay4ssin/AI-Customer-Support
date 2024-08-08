// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBegBUHi-SEMCqnaN6YLmlR-dPMIs6NcY",
  authDomain: "inventory-management-9759f.firebaseapp.com",
  projectId: "inventory-management-9759f",
  storageBucket: "inventory-management-9759f.appspot.com",
  messagingSenderId: "330058636171",
  appId: "1:330058636171:web:14c8b310144ede014eed8e",
  measurementId: "G-ZM3EWBKM3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{firestore}