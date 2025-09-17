// utils/firebaseAuth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import toast from "react-hot-toast";
import { firebaseErrorToFriendly } from "./constants";

export const handleSignup = async (
  email,
  password,
  name,
 
  router
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("userCredential", userCredential);


    await updateProfile(userCredential.user, { displayName: name });

    toast.success("Account created — redirecting…");
  
    router.push("/chat");
  } catch (error) {
    console.log("Firebase signup error (full):", error);
   
    const message = error?.customData?.message || error?.message || error?.code || "Signup failed";
   
    toast.error(firebaseErrorToFriendly(message));
  }
};


export const handleSignin = async (email, password, router, ) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Signed in — redirecting…");
   
    router.push("/chat");
  } catch (error) {
    console.log("Firebase signin error (full):", error);
    const message = error?.customData?.message || error?.message || error?.code || "Sign in failed";
   
    toast.error(firebaseErrorToFriendly(message));
  }
};
