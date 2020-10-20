import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDI7bKNIdbMzTd2llSpZlwE8h5cSInjSzE",
  authDomain: "eservices-6edbb.firebaseapp.com",
  databaseURL: "https://eservices-6edbb.firebaseio.com",
  projectId: "eservices-6edbb",
  storageBucket: "eservices-6edbb.appspot.com",
  messagingSenderId: "526090057055",
  appId: "1:526090057055:web:cec3e6628415e7d2b0f2ea",
  measurementId: "G-TDVX2D4TKY",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
