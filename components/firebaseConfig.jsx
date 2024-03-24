import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAHSeZ3HCCRWMQyrLjvf1hiUriHGAgZu7Y",
    authDomain: "seequre-e4c24.firebaseapp.com",
    projectId: "seequre-e4c24",
    storageBucket: "seequre-e4c24.appspot.com",
    messagingSenderId: "922655013029",
    appId: "1:922655013029:web:e983d0be963813eb8af54c",
    measurementId: "G-43DWN09F8M"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }


export { firebase};  