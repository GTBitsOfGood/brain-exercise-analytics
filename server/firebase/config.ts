import * as admin from "firebase-admin";
import { logError } from "@server/utils/log";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (err: any) {
  if (!/already exists/u.test(err.message)) {
    logError("Firebase admin initialization error", err.stack);
  }
}

export default admin;
