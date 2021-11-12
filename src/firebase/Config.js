import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGXBF7TtY249QGvHBTTqTHx2laT4dcNyI",
  authDomain: "firegram-4b80f.firebaseapp.com",
  projectId: "firegram-4b80f",
  storageBucket: "firegram-4b80f.appspot.com",
  messagingSenderId: "600693377103",
  appId: "1:600693377103:web:487cfd9d9597f75510423a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const projectStorage = getStorage(app);
const projectFireStore = getFirestore(app);

export { projectFireStore, projectStorage };