export const firebaseErrorToFriendly = (codeOrMessage) => {
  console.log("codeOrMessage", codeOrMessage);

  if (!codeOrMessage) return "Something went wrong";

  // normalize
  const msg = codeOrMessage.toLowerCase();

  if (msg.includes("auth/email-not-found")) return "Email not found. Try signing up.";
  if (msg.includes("auth/email-already-in-use")) return "Email already in use. Try signing in.";
  if (msg.includes("auth/weak-password")) return "Password too weak. Minimum 6 characters.";
  if (msg.includes("auth/invalid-email")) return "Please enter a valid email.";
  if (msg.includes("auth/operation-not-allowed")) return "Email/password sign-in disabled in Firebase console.";

  return codeOrMessage; // fallback
};
