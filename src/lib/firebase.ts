import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration for client-side usage
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log configuration (without sensitive data)
console.log('Firebase Config Check:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
let app;
let db;

try {
  console.log('Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  console.log('Getting Firestore instance...');
  db = getFirestore(app);
  console.log('Firestore instance created successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

export { db };

// Function to add email and name to Firestore
export const addEmailToCollection = async (email: string, name: string) => {
  console.log('addEmailToCollection called with:', { email, name });
  
  if (!db) {
    console.error('Firestore db is not initialized');
    throw new Error('Firebase database not initialized');
  }

  try {
    console.log('Creating collection reference for "Emails"...');
    const emailsCollection = collection(db, 'Emails');
    console.log('Collection reference created:', emailsCollection);

    const emailData = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      timestamp: new Date(),
      source: 'funnel',
      createdAt: new Date().toISOString(),
    };
    
    console.log('Preparing to add document with data:', emailData);
    
    const docRef = await addDoc(emailsCollection, emailData);
    console.log('Email added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Detailed error in addEmailToCollection:', {
      error: error,
      errorMessage: error.message,
      errorCode: error.code,
      errorStack: error.stack,
      dbExists: !!db,
      email: email,
      name: name
    });
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error(`Firestore permission denied. Check security rules for "Emails" collection. Error: ${error.message}`);
    } else if (error.code === 'unavailable') {
      throw new Error(`Firebase service unavailable. Check your internet connection and Firebase project status. Error: ${error.message}`);
    } else if (error.code === 'unauthenticated') {
      throw new Error(`Firebase authentication failed. Check your API key and project configuration. Error: ${error.message}`);
    } else {
      throw new Error(`Firebase error (${error.code || 'unknown'}): ${error.message}`);
    }
  }
}; 