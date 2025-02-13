import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createCollections() {
  try {
    // Check if contact_messages collection exists
    const contactMessagesRef = collection(db, 'contact_messages');
    const contactMessagesSnapshot = await getDocs(contactMessagesRef);
    if (contactMessagesSnapshot.empty) {
      await addDoc(contactMessagesRef, {
        name: 'Sample Name',
        email: 'sample@example.com',
        message: 'This is a sample message.',
        division: 'Sample Division',
        created_at: new Date(),
        is_read: false,
      });
      console.log('contact_messages collection created with a sample document.');
    } else {
      console.log('contact_messages collection already exists.');
    }

    // Check if settings collection exists
    const settingsRef = collection(db, 'settings');
    const settingsSnapshot = await getDocs(settingsRef);
    if (settingsSnapshot.empty) {
      await addDoc(settingsRef, {
        contact_email: 'contact@example.com',
      });
      console.log('settings collection created with a sample document.');
    } else {
      console.log('settings collection already exists.');
    }
  } catch (error) {
    console.error('Error creating collections:', error);
  }
}

createCollections();
