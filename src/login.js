import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDK_jbI90zzTSC1uJQADrgUAo9i3GHfprM",
    authDomain: "tabmaster-acab4.firebaseapp.com",
    projectId: "tabmaster-acab4",
    storageBucket: "tabmaster-acab4.appspot.com",
    messagingSenderId: "857728515610",
    appId: "1:857728515610:web:a39d81446ac2b75d099ba3",
    measurementId: "G-HYC69ENN62"
};

const app = initializeApp(firebaseConfig);

console.log(app)