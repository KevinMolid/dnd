import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

const getFallbackDisplayName = (user: User) => {
  const displayName = user.displayName?.trim();

  if (displayName) {
    return displayName;
  }

  const emailName = user.email?.split("@")[0]?.trim();

  return emailName || "Player";
};

/**
 * Makes sure every Firebase Auth user also has the Firestore profile document
 * Lorebound expects at /users/{uid}.
 *
 * This is particularly important for federated providers such as Google,
 * because Firebase Auth creates the Auth account automatically but does not
 * create your application-specific Firestore user document.
 */
export const ensureUserProfileDocument = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return;
  }

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email ?? null,
    displayName: getFallbackDisplayName(user),
    role: "player",
    campaignIds: [],
    imageUrl: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  });
};

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: "dm" | "player" = "player",
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName });

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    email,
    displayName,
    role,
    campaignIds: [],
    createdAt: serverTimestamp(),
  });

  return cred.user;
};

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await ensureUserProfileDocument(cred.user);

  return cred.user;
};

export const loginWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);

  await ensureUserProfileDocument(cred.user);

  return cred.user;
};

export const resetPassword = async (email: string) => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    throw new Error("Enter your email address.");
  }

  await sendPasswordResetEmail(auth, trimmedEmail);
};

export const logoutUser = async () => {
  await signOut(auth);
};
