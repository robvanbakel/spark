import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "scheduler-cb321.firebaseapp.com",
  databaseURL: "https://scheduler-cb321-default-rtdb.firebaseio.com",
  projectId: "scheduler-cb321",
  storageBucket: "scheduler-cb321.appspot.com",
  messagingSenderId: "1035205227793",
  appId: "1:1035205227793:web:76e679a202d101b27108b0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const db = firebase.firestore()

export { auth, db }