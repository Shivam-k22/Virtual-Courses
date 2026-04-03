import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "loginvirtualcourses-3f4f3.firebaseapp.com",
  projectId: "loginvirtualcourses-3f4f3",
  storageBucket: "loginvirtualcourses-3f4f3.firebasestorage.app",
  messagingSenderId: "334333316136",
  appId: "1:334333316136:web:dd4b6b9c1b78b64f0b391d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

export { auth, provider };