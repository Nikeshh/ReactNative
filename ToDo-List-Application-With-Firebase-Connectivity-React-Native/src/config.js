import Firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyAozxX3p9OKX2AWertjzUEdSPP5pFBGaik",
    authDomain: "loginapplication-efd2c.firebaseapp.com",
    databaseURL: "https://loginapplication-efd2c.firebaseio.com",
    projectId: "loginapplication-efd2c",
    storageBucket: "loginapplication-efd2c.appspot.com",
    messagingSenderId: "457777169220",
    appId: "1:457777169220:web:bc8f0f665f6a78ebe2cd11",
    measurementId: "G-5XXNE5TW6V"
  };
const app = Firebase.initializeApp(firebaseConfig);
export const db = app.database();