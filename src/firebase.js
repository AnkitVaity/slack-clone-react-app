import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBEJlNLqxmnzE6K95o0bYAi7yTqibaWJkw",
  authDomain: "react-slack-clone-dfec1.firebaseapp.com",
  databaseURL: "https://react-slack-clone-dfec1.firebaseio.com",
  projectId: "react-slack-clone-dfec1",
  storageBucket: "react-slack-clone-dfec1.appspot.com",
  messagingSenderId: "612103563251",
  appId: "1:612103563251:web:b242147db457816fd81486",
  measurementId: "G-PMN2GVZZDB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
