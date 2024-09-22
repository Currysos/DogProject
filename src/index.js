/*
    This is a project made for dog competitions where this app will make it easier for competitors and hosts
    to regulate who is starting when. 

    The project is in development state. Make sure to have node.js installed with these packages webpack, webpack-cli, serve. 
    To build: 'node_modules/-bin/webpack'
    Open 'index.html' or run 'serve dist/' from the terminal to open the web-app

    Made by Noah Hjerdin
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBUU59RSjaY474U8im00EiIc1kYmqbgB4",
  authDomain: "dogproject-afa73.firebaseapp.com",
  projectId: "dogproject-afa73",
  storageBucket: "dogproject-afa73.appspot.com",
  messagingSenderId: "334223697188",
  appId: "1:334223697188:web:1f2e460df8dcd7f9bdffb1",
  measurementId: "G-6G6097VHK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);

// Detect auth state
onAuthStateChanged(auth, user => {
    if(user != null) {
        console.log('Logged in!');
    } else {
        console.log('No user');
    }
});