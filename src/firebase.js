// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0Wx8vM3zj0NutOkTodPGkHeVhXEUmiTU",
  authDomain: "rap-camp-bracket.firebaseapp.com",
  projectId: "rap-camp-bracket",
  storageBucket: "rap-camp-bracket.firebasestorage.app",
  messagingSenderId: "963907450578",
  appId: "1:963907450578:web:d5573e0be40268805edf0b",
  measurementId: "G-R23W1CJ58G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);