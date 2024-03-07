// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUu9r0RZUsimNG9dYms7mkVXIF64bvIE4",
  authDomain: "podcast-platform-9c148.firebaseapp.com",
  projectId: "podcast-platform-9c148",
  storageBucket: "podcast-platform-9c148.appspot.com",
  messagingSenderId: "718916150489",
  appId: "1:718916150489:web:1f0e9fb75535b678700ac8",
  measurementId: "G-K58GRP1BTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {auth, db, storage};