importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');
//importScripts('https://www.gstatic.com/firebase/init.js')

firebase.initializeApp({
    apiKey: "AIzaSyAyVn6LEfP3EYTySFsmlSbioVjLV5XeifY",
    authDomain: "team-prism.firebaseapp.com",
    databaseURL: "https://team-prism.firebaseio.com",
    projectId: "team-prism",
    storageBucket: "team-prism.appspot.com",
    messagingSenderId: "187528289115",
    appId: "1:187528289115:web:109e5ed7ffabe1c33a187e",
    measurementId: "G-WKPHB22G53"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    /*const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: './assets/logo-new.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);*/
});

