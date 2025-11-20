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

// Function to add email and name to Firestore only (no webhook)
export const addEmailToFirestore = async (email: string, name: string, phone: string, funnelType: 'PDF' | 'Training' | 'Roadmap' | 'Fitness_Funnel_Playbook' | 'AI_Roadmap' | 'Complete_System' = 'PDF') => {
  try {
    const docRef = await addDoc(collection(db, 'Emails'), {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone.trim(),
      timestamp: new Date(),
      source: 'funnel',
      funnel_type: funnelType,
      createdAt: new Date().toISOString(),
    });
    if (import.meta.env.DEV) {
      console.log('✅ Email added to Firestore successfully');
    }
    return { success: true, docId: docRef.id };
  } catch (error) {
    // Always log errors
    console.error('❌ Error adding email to Firestore:', error);
    throw error;
  }
};

// Function to add email and name to Firestore and send welcome email
export const addEmailToCollection = async (email: string, name: string, phone: string, funnelType: 'PDF' | 'Training' | 'Roadmap' | 'Fitness_Funnel_Playbook' | 'AI_Roadmap' | 'Complete_System' = 'PDF') => {
  try {
    // First, add to Firestore
    const docRef = await addDoc(collection(db, 'Emails'), {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone.trim(),
      timestamp: new Date(),
      source: 'funnel',
      funnel_type: funnelType,
      createdAt: new Date().toISOString(),
    });
    // Then, send welcome email with roadmap PDF
    const emailSent = await sendWelcomeEmail(email, name, phone, funnelType);
    if (emailSent) {
      if (import.meta.env.DEV) {
        console.log('✅ Email added to collection and welcome email sent successfully');
      }
      return { success: true, docId: docRef.id };
    } else {
      // Always log warnings
      console.warn('⚠️ Email added to collection but welcome email failed to send');
      return { success: true, docId: docRef.id, emailWarning: true };
    }
  } catch (error) {
    // Always log errors
    console.error('❌ Error adding email to collection:', error);
    throw error;
  }
}; 