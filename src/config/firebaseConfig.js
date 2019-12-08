import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyAToKbxweCS4cWKmfTD2ke48jXoP-UUs3Y",
    authDomain: "cse316finalproject-c82bf.firebaseapp.com",
    databaseURL: "https://cse316finalproject-c82bf.firebaseio.com",
    projectId: "cse316finalproject-c82bf",
    storageBucket: "cse316finalproject-c82bf.appspot.com",
    messagingSenderId: "244109501625",
    appId: "1:244109501625:web:8ab12a9964bfa26973a768"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;