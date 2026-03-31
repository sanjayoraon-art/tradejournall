import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfigStr = `{"apiKey":"AIzaSyDJNkn_YMGbB0kVoy6D85wiijPHVlC-WbM","authDomain":"tradejournall-71bb6.firebaseapp.com","projectId":"tradejournall-71bb6","storageBucket":"tradejournall-71bb6.firebasestorage.app","messagingSenderId":"410080644372","appId":"1:410080644372:web:acbd902781bcf704179339"}`;
if (!firebaseConfigStr) {
    console.error("No VITE_FIREBASE_CONFIG found in environment");
    process.exit(1);
}

const firebaseConfig = JSON.parse(firebaseConfigStr);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    console.log("Testing Firestore connection...");
    try {
        // Try reading config to see if read works (Rule says read: if true)
        console.log("Attempting to read from artifacts/trade-journal-pro/blog...");
        const snap = await getDocs(collection(db, 'artifacts', 'trade-journal-pro', 'blog'));
        console.log(`Success! Found ${snap.size} documents in blog.`);

        // Now attempt a small write (Without auth, should be blocked by rules, but let's see what happens)
        console.log("Attempting unauthenticated write...");
        // This should throw Permission Denied immediately! Not timeout.
        await addDoc(collection(db, 'artifacts', 'trade-journal-pro', 'blog'), { test: true });
        console.log("Write succeeded! (Wait, rules say auth != null, so this means rules are too open or wrong)");
    } catch (err: any) {
        console.error("Firestore Error Caught:", err.code, err.message);
    }
    process.exit(0);
}

test();
