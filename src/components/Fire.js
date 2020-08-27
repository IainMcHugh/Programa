import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBxQbFuPFIKCV4D1Gno4lzBN8CX9HIM_s8",
    authDomain: "program-46f7f.firebaseapp.com",
    databaseURL: "https://program-46f7f.firebaseio.com",
    projectId: "program-46f7f",
    storageBucket: "program-46f7f.appspot.com",
    messagingSenderId: "862377489435",
    appId: "1:862377489435:web:d0cb6d6c77ee729cd674be",
    measurementId: "G-HG0GBREHQW"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
export default fire;