"use client";
import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useAuthStore } from "../zustand/useAuthStore";
import { useFetchUsers } from "../hooks/useFetchUsers";
import ChatUsers from "../_components/chatUsers";

const UsersList = () => {
  const { updateAuthName } = useAuthStore();
  const { loading } = useFetchUsers();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateAuthName(user.displayName || "Anonymous");
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, [updateAuthName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex divide-x-4">
      <div className="w-1/5">
        <ChatUsers />
      </div>
      <div className="w-4/5 flex flex-col">
        <div className="1/5">
          <h1>Chat Area</h1>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
