// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoUSEzGTrEjoi_BlD8-znRufYbWDxePjU",
  authDomain: "pantry-tracker-1ce52.firebaseapp.com",
  projectId: "pantry-tracker-1ce52",
  storageBucket: "pantry-tracker-1ce52.appspot.com",
  messagingSenderId: "1000711538264",
  appId: "1:1000711538264:web:f966e68dfd2406eda82c2d",
  measurementId: "G-PNJ7SXN9FV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);

export{fireStore};