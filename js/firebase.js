// firebase.js - update imports to match
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  getFirestore,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-storage.js";

// ... rest unchanged
const firebaseConfig = {
  apiKey: "AIzaSyDRgvpDZVmqjfTA9RDU58XOtOnMj3w5dHA",
  authDomain: "farhan-rehan-collections.firebaseapp.com",
  projectId: "farhan-rehan-collections",
  storageBucket: "farhan-rehan-collections.firebasestorage.app", // ✅ FIXED
  messagingSenderId: "865929030777",
  appId: "1:865929030777:web:462df96267452ed579b8a8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
enableIndexedDbPersistence(db, { synchronizeTabs: true })
  .catch(err => {
    console.warn("Firestore persistence:", err.code);
  });

export const storage = getStorage(app);
