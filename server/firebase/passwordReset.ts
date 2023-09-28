// import admin from "./config";
import { UserRecord } from "firebase-admin/auth";
import auth from "./auth";

const getUserByEmail = async (email: string): Promise<UserRecord | null> => {
  const value = await auth.getUserByEmail(email);
  return value;
};

export const updateUserPassword = async (
  email: string,
  password: string,
): Promise<boolean> => {
  const userRecord = await getUserByEmail(email);
  if (!userRecord) {
    throw new Error("user not found");
  }

  await auth.updateUser(userRecord.uid, {
    password,
  });

  return true;
};
