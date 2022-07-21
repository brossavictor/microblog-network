// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBq8d7qW6ZBngLy3Oglswpn0PpN2kIVELc',
  authDomain: 'microblog-network.firebaseapp.com',
  projectId: 'microblog-network',
  storageBucket: 'microblog-network.appspot.com',
  messagingSenderId: '421885144992',
  appId: '1:421885144992:web:7f1af41686c761f7707ec5',
  measurementId: 'G-Q73B0TV3F3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
