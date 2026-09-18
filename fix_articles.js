import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaNUTiyitKI-4rvjI6NC60RmxcEJA9OCk",
  authDomain: "kascoten1.firebaseapp.com",
  projectId: "kascoten1",
  storageBucket: "kascoten1.firebasestorage.app",
  messagingSenderId: "848423451775",
  appId: "1:848423451775:web:d8cd4f7612fc405269534a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixArticles() {
  const articlesRef = collection(db, 'articles');
  const snapshot = await getDocs(articlesRef);
  
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.content && typeof data.content === 'string') {
      let needsUpdate = false;
      let newContent = data.content;
      
      // Replace literal '\n' (two characters: backslash and n) with actual newline
      if (newContent.includes('\\n')) {
        newContent = newContent.replace(/\\n/g, '\n');
        needsUpdate = true;
      }
      
      // Also, if someone typed '/n' as the user said
      if (newContent.includes('/n')) {
        newContent = newContent.replace(/\/n/g, '\n');
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Fixing article: ${data.title} (${document.id})`);
        const docRef = doc(db, 'articles', document.id);
        try {
          await updateDoc(docRef, { content: newContent });
          console.log(`Successfully updated ${document.id}`);
        } catch (e) {
          console.error(`Failed to update ${document.id}`, e);
        }
      }
    }
  }
  console.log('Done!');
  process.exit(0);
}

fixArticles();
