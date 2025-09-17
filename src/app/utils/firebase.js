// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcex989BBoN92aQvi4L6LLzEI1OTqGdVM",
  authDomain: "chat-app-b69f7.firebaseapp.com",
  projectId: "chat-app-b69f7",
  storageBucket: "chat-app-b69f7.firebasestorage.app",
  messagingSenderId: "34814223587",
  appId: "1:34814223587:web:51b97e58aa049418f191d6",
  measurementId: "G-WNQY6SNVQW"
};
console.log("app has been initalized")
// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("app::",app)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };
export const auth = getAuth();
