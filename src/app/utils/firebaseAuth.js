
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase"; // Make sure to export db from your firebase config
import toast from "react-hot-toast";
import { firebaseErrorToFriendly } from "./constants";



 
export const handleSignup = async (
  email,
  password,
  name,
  router,
  
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("userCredential", userCredential);

    await updateProfile(userCredential.user, { displayName: name });

    // Save user data to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      createdAt: new Date().toISOString(),
      isActive: true
    });

 

    toast.success("Account created — redirecting…");
    router.push("/login");
  } catch (error) {
    console.log("Firebase signup error (full):", error);
    const message = error?.customData?.message || error?.message || error?.code || "Signup failed";
    toast.error(firebaseErrorToFriendly(message));
  }
};


export const handleSignin = async (email, password, router,updateAuthdetails) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Signed in — redirecting…");
    router.push("/");
    updateAuthdetails(userCredential.user);
  } catch (error) {
    console.log("Firebase signin error (full):", error);
    const message = error?.customData?.message || error?.message || error?.code || "Sign in failed";
    toast.error(firebaseErrorToFriendly(message));
  }
};

// Function to get all users from Firestore
export const getAllUsers = async (currentUid) => {
  console.log("currentUid", currentUid);
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
   const usersList = usersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.uid !== currentUid); // exclude current user
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to fetch users");
    return [];
  }
};