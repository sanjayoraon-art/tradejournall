import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Default config or load from env
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
let firebaseConfig = null;

try {
    if (firebaseConfigString) {
        firebaseConfig = typeof firebaseConfigString === 'string' ? JSON.parse(firebaseConfigString) : firebaseConfigString;
    }
} catch (e) { }

export const appId = import.meta.env.VITE_APP_ID || 'default-app-id';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (firebaseConfig) {
    try {
        app = initializeApp(firebaseConfig);
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        });
        auth = getAuth(app);
        storage = getStorage(app);
    } catch (e) { }
} else {
    console.warn("Firebase configuration not found in environment variables (VITE_FIREBASE_CONFIG).");
}

export { app, db, auth, storage, firebaseConfig };
