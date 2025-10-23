import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
// import * as firebase from "firebase/app";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDsq9ngR8w8HrDEWGuzgYWZWlHCtu1RVms",
  authDomain: "quick-events-gh.firebaseapp.com",
  projectId: "quick-events-gh",
  storageBucket: "quick-events-gh.appspot.com",
  messagingSenderId: "919136725190",
  appId: "1:919136725190:web:97410b9007c86016ba8fc7",
  measurementId: "G-PBJVDM3E34"
};

// // From Quick Discount
// const firebaseConfig = {
//   apiKey: "AIzaSyDOeyMgPQMzZ17hdbTi5zrfEHMb3ZflQ04",
//   authDomain: "quick-discount-ef7b4.firebaseapp.com",
//   projectId: "quick-discount-ef7b4",
//   storageBucket: "quick-discount-ef7b4.firebasestorage.app",
//   messagingSenderId: "812808874677",
//   appId: "1:812808874677:web:70e0263aeca89b9c84ecfc",
//   measurementId: "G-4WBK80ETPV"
// };


// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

const storage = firebase.storage()

// App ANALYTICS
// const analytics = getAnalytics(firebaseApp);

export {auth, provider, storage};
export default db;