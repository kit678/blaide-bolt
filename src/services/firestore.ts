import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase app is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase Config:', firebaseConfig);

// Export the db instance
export { db };

type ContactMessage = {
  name: string;
  email: string;
  phone?: string | null;
  division: string;
  message: string;
  created_at: Date;
  is_read: boolean;
};

export async function addContactMessage(message: ContactMessage) {
  try {
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      ...message,
      created_at: serverTimestamp() // Use server timestamp for consistency
      
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document to Firestore:', error);
    throw error;
  }
} 