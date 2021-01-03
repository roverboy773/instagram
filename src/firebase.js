// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyDjsjZp0gfp9Mgf1qjnGIl0s6uNcEvMRUs",
    authDomain: "instagram-clone-a-a3477.firebaseapp.com",
    databaseURL: "https://instagram-clone-a-a3477-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-a-a3477",
    storageBucket: "instagram-clone-a-a3477.appspot.com",
    messagingSenderId: "27684701382",
    appId: "1:27684701382:web:d65e8fc7ae5c26919a03c7",
    measurementId: "G-5R7317CHXC"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export  {db,auth,storage}