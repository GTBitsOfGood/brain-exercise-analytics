import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import firebaseInit from "@src/firebase/config";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export default async function googleSignIn() {
  firebaseInit();
  const auth = getAuth();
  return signInWithPopup(auth, provider).then((result) => {
    if (result) {
      const { user } = result;
      return user;
    }
    return null;
  });
}
