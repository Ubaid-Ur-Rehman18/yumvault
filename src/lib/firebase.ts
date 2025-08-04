import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGN2HRVBD7f-4AjjQrO25XtDX2Me3FYQE",
  authDomain: "yumvault-78fad.firebaseapp.com",
  projectId: "yumvault-78fad",
  storageBucket: "yumvault-78fad.appspot.com", // ✅ yaha .app hata ke .appspot.com karo
  messagingSenderId: "994978807478",
  appId: "1:994978807478:web:17742c74ccb1fd58213017",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // ✅ Ye line add karni zaroori hai
