import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAdmN7Qf2Ce6j6AeNAsv2TBm8mWP8pTSpA',
  authDomain: 'sneakineazey.firebaseapp.com',
  projectId: 'sneakineazey',
  storageBucket: 'sneakineazey.appspot.com',
  messagingSenderId: '70351151201',
  appId: '1:70351151201:web:2b7148315273042543ca20',
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebase;
