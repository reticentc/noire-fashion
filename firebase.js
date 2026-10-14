
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDGlRc_5bwQdcTKy_nPEByUgz0iOAq-Yag",
    authDomain: "noire-fashion-83f13.firebaseapp.com",
    projectId: "noire-fashion-83f13",
    storageBucket: "noire-fashion-83f13.firebasestorage.app",
    messagingSenderId: "804530127028",
    appId: "1:804530127028:web:9957e0d851d00c648f57e1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
