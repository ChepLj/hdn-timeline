// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD3czwyxlVa4H_Xba77zE-COosZAUukjY8",
  authDomain: "hdn-timeline.firebaseapp.com",
  databaseURL: "https://hdn-timeline-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hdn-timeline",
  storageBucket: "hdn-timeline.appspot.com",
  messagingSenderId: "1001884171940",
  appId: "1:1001884171940:web:caae44d424fa60c897f031",
  measurementId: "G-1KS0QP9BNS",
   databaseURL: 'https://hdn-timeline-default-rtdb.asia-southeast1.firebasedatabase.app/',
 
 };
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const providerGG = new GoogleAuthProvider()
// const analytics = getAnalytics(app);
 const storage = getStorage(app);
 const database = getDatabase(app);
export { auth, database, providerGG, storage };
