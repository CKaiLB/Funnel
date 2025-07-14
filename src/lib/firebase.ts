import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { sendWelcomeEmail } from './email';

// Firebase configuration for client-side usage
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to add email and name to Firestore and send welcome email
export const addEmailToCollection = async (email: string, name: string, funnelType: 'PDF' | 'Training' | 'Roadmap' = 'PDF') => {
  try {
    // First, add to Firestore
    const docRef = await addDoc(collection(db, 'Emails'), {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      timestamp: new Date(),
      source: 'funnel',
      funnel_type: funnelType,
      createdAt: new Date().toISOString(),
    });

    // Then, send welcome email with roadmap PDF
    const emailSent = await sendWelcomeEmail(email, name, funnelType);
    
    if (emailSent) {
      console.log('Email stored and welcome email sent successfully');
    } else {
      console.log('Email stored but welcome email failed to send');
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding email to collection:', error);
    throw error;
  }
}; 