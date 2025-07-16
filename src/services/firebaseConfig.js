import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBIEzZ2zTK7hRlSiSi-PaUKbfOKX4cIhwQ",
  authDomain: "canada-student-integration.firebaseapp.com",
  projectId: "canada-student-integration",
  storageBucket: "canada-student-integration.appspot.com",
  messagingSenderId: "691452627832",
  appId: "1:691452627832:web:d608dbcb45211e3247168d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

