import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "swag-gp.firebaseapp.com",
  databaseURL: "https://swag-gp.firebaseio.com",
  projectId: "swag-gp",
  storageBucket: "swag-gp.appspot.com",
  messagingSenderId: "26704617773",
  appId: "1:26704617773:web:40f1e9fe7cbe85435f33a4",
  measurementId: "G-W0CBVQ8NSH"
};

firebase.initializeApp(config);
export default firebase;
export const auth = firebase.auth();
export const db = firebase.firestore();