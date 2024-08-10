import { getFirestore } from 'firebase/firestore';// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

  const firebaseConfig = {
  apiKey: "AIzaSyBlE7K5USTV-UgZZ-zIOjGaKU6lisdkUaM",
  authDomain: "customer-support-ai-9860f.firebaseapp.com",
  projectId: "customer-support-ai-9860f",
  storageBucket: "customer-support-ai-9860f.appspot.com",
  messagingSenderId: "40832850694",
  appId: "1:40832850694:web:9d3bdf41e6e6adc0845c87",
  measurementId: "G-1CPJ2R7K8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const firestore = getFirestore(app);
export default app;

// Export Firestore and Auth
export { firestore };
