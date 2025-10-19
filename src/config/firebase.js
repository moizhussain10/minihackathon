import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged,signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBExmafviRq_Dg_c8DMhHRsbTXxViHQhbo",
  authDomain: "hackathon-47c73.firebaseapp.com",
  projectId: "hackathon-47c73",
  storageBucket: "hackathon-47c73.firebasestorage.app",
  messagingSenderId: "137925203659",
  appId: "1:137925203659:web:349e35d9c7890f48fead4e",
  measurementId: "G-0VTHLHC5LP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    createUserWithEmailAndPassword ,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    db
}