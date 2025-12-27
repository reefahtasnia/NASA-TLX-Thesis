// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8HNMdBxyuJcw0BusUmXan5SYTf8hHXac",
  authDomain: "nasa-tlx-thesis.firebaseapp.com",
  databaseURL: "https://nasa-tlx-thesis-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nasa-tlx-thesis",
  storageBucket: "nasa-tlx-thesis.firebasestorage.app",
  messagingSenderId: "414549447170",
  appId: "1:414549447170:web:dbe2145124ba8046900d1b",
  measurementId: "G-HT7D60TRSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);