import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCW8oMLEMRosKPzy1nJwXyyWZM1YL2_pv0",
  authDomain: "hair-coaction-4940e.firebaseapp.com",
  projectId: "hair-coaction-4940e",
  storageBucket: "hair-coaction-4940e.firebasestorage.app",
  messagingSenderId: "349364008358",
  appId: "1:349364008358:web:5ca253307ef53fb2aacb67",
  measurementId: "G-0T7PT6K9M2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app); // Remove unused variable warning

export { auth, provider, signInWithPopup };