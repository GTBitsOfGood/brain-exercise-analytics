import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

async function emailSignUp(email: string, password: string) {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

async function emailSignIn(email: string, password: string) {
  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export { emailSignUp, emailSignIn };
