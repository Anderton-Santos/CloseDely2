import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'



const firebaseConfig = {
  apiKey: "AIzaSyD5LRLh7BlJhwLl9hGMYMmftbNZX-4DjZU",
  authDomain: "closedely-bd608.firebaseapp.com",
  projectId: "closedely-bd608",
  storageBucket: "closedely-bd608.appspot.com",
  messagingSenderId: "63581838702",
  appId: "1:63581838702:web:4d5beab5ac0f9c6bfc757f"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db};