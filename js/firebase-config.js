// Importa as funções do SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN6t8nhHJlYlSuPZa5kNbBvlxI5g4Ig7g",
  authDomain: "siteloja-8f6fc.firebaseapp.com",
  projectId: "siteloja-8f6fc",
  storageBucket: "siteloja-8f6fc.firebasestorage.app",
  messagingSenderId: "305863413152",
  appId: "1:305863413152:web:3cc648f479debeaa09e8c5",
  measurementId: "G-6F84STNS3T"
};

// Inicializa e exporta para usar nos outros arquivos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { 
    db, storage, auth, 
    collection, addDoc, getDocs, onSnapshot,
    ref, uploadBytes, getDownloadURL,
    signInWithEmailAndPassword, onAuthStateChanged, signOut
};
