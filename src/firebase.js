try {
    self.importScripts('firebase/firebase-app.js', 'firebase/firebase-auth.js', 'firebase/firebase-firestore.js');

    const firebaseConfig = {
        apiKey: "AIzaSyDK_jbI90zzTSC1uJQADrgUAo9i3GHfprM",
        authDomain: "tabmaster-acab4.firebaseapp.com",
        projectId: "tabmaster-acab4",
        storageBucket: "tabmaster-acab4.appspot.com",
        messagingSenderId: "857728515610",
        appId: "1:857728515610:web:a39d81446ac2b75d099ba3",
        measurementId: "G-HYC69ENN62"
    };
    
    firebase.initializeApp(firebaseConfig);

    console.log(firebase);


    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .then(function(user) {
    //     // Signed in
    //     // ...
    //     console.log(user, ' signed in');
    // })
    // .catch(function(error) {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    // });

    // const db = firebase.firestore();
    // db.collection("users").add({
    //     name: "John Doe",
    //     email: "johndoe@example.com"
    // })
    // .then(function(docRef) {
    //     console.log("Document written with ID: ", docRef.id);
    // })
    // .catch(function(error) {
    //     console.error("Error adding document: ", error);
    // });

    // if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', function() {
    //     navigator.serviceWorker.register('/service-worker.js')
    //         .then(function(registration) {
    //         console.log('Service worker registered:', registration);
    //         })
    //         .catch(function(error) {
    //         console.error('Service worker registration failed:', error);
    //         });
    //     });
    // }
}

catch(e) {
    console.log(e);
}