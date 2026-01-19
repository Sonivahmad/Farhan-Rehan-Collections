// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";


// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDRgvpDZVmqjfTA9RDU58XOtOnMj3w5dHA",
  authDomain: "farhan-rehan-collections.firebaseapp.com",
  projectId: "farhan-rehan-collections",
  storageBucket: "farhan-rehan-collections.firebasestorage.app",
  messagingSenderId: "865929030777",
  appId: "1:865929030777:web:462df96267452ed579b8a8"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


