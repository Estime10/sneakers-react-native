import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAdmN7Qf2Ce6j6AeNAsv2TBm8mWP8pTSpA',
  authDomain: 'sneakineazey.firebaseapp.com',
  projectId: 'sneakineazey',
  storageBucket: 'sneakineazey.appspot.com',
  messagingSenderId: '70351151201',
  appId: '1:70351151201:web:2b7148315273042543ca20',
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestoreDB = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth with AsyncStorage for persistence
const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, firebaseAuth, firestoreDB, storage };
