import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import firebaseInit from "@src/firebase/config";

async function emailSignUp(email: string, password: string) {
  firebaseInit();
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

async function emailSignIn(email: string, password: string) {
  firebaseInit();
  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export { emailSignUp, emailSignIn };
