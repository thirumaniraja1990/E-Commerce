import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBvlfz2o5XqybvaJ5oqSn72j2Fi61r76ys",
  authDomain: "msm-angadi.firebaseapp.com",
  projectId: "msm-angadi",
  storageBucket: "msm-angadi.appspot.com",
  messagingSenderId: "403195702895",
  appId: "1:403195702895:web:c05d917ad3f8666ae8a79a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;