import { FirebaseError } from "firebase-admin";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const auth = getAuth();
export default async function passwordReset(
  oldPassword: string,
  password: string,
) {
  const user = auth.currentUser;
  if (!user) {
    throw Error("Could not update password");
  }
  // console.log("Updating password");
  try {
    const credential = EmailAuthProvider.credential(
      user.email as string,
      oldPassword,
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, password);
  } catch (e) {
    const err: FirebaseError = e as FirebaseError;
    if (err.code === "auth/wrong-password") {
      throw Error("Old Password is incorrect");
    } else if (err.code === "auth/weak-password") {
      throw Error("New Password is weak");
    } else {
      throw Error("Error during password change");
    }
  }
}
