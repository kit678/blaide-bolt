import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

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
    // Create contact_messages collection with sample document
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
      console.log('Added sample document to contact_messages collection');
    }

    // Create settings collection with sample document
    const settingsRef = collection(db, 'settings');
    const settingsSnapshot = await getDocs(settingsRef);
    
    if (settingsSnapshot.empty) {
      await addDoc(settingsRef, {
        contact_email: 'contact@example.com',
      });
      console.log('Added sample document to settings collection');
    }

    console.log('Firestore initialization completed successfully');
  } catch (error) {
    console.error('Firestore initialization failed:', error);
    process.exit(1);
  }
}

createCollections();