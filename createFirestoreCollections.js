import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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
    // Create contact_messages collection with a sample document
    await addDoc(collection(db, 'contact_messages'), {
      name: 'Sample Name',
      email: 'sample@example.com',
      message: 'This is a sample message.',
      division: 'Sample Division',
      created_at: new Date().toISOString(),
      is_read: false,
    });
    console.log('contact_messages collection created with a sample document.');

    // Create settings collection with a sample document
    await addDoc(collection(db, 'settings'), {
      contact_email: 'contact@example.com',
    });
    console.log('settings collection created with a sample document.');
  } catch (error) {
    console.error('Error creating collections:', error);
  }
}

createCollections();
