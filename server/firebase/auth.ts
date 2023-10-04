import { getAuth } from "firebase-admin/auth";

export const getEmailFromIdToken = async (idToken: string): Promise<string> => {
  const auth = getAuth();
  return auth.verifyIdToken(idToken).then((decodedToken) => {
    if (decodedToken.email === undefined) {
      throw new Error("User does not have an email");
    }
    return decodedToken.email;
  });
};
