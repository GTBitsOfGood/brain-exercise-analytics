import admin from "./config";

const auth = admin.auth();

export const getEmailFromIdToken = async (idToken: string): Promise<string> => (
  auth
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      if (decodedToken.email === undefined) {
        throw new Error("User does not have an email");
      }
      return decodedToken.email;
    })
);

export default auth;
