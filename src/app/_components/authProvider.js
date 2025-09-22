"use client";

import React, { useEffect } from "react";
import { onAuthStateChanged,  } from "firebase/auth";
import { useAuthStore } from "../zustand/useAuthStore";
import { auth } from "../utils/firebase";





export default function AuthProvider({ children }) {
  const{updateAuthdetails}=useAuthStore()
  

  useEffect(() => {
    // subscribe to firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user is logged in send whole user details
        updateAuthdetails(user);
      } else {
        // user is signed out
      
        updateAuthdetails(null,);

      }
    
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
