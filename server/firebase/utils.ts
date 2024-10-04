import { getAuth, UserRecord } from "firebase-admin/auth";

const getUserByEmail = async (email: string): Promise<UserRecord | null> => {
  console.log("-1")
  const value = await getAuth().getUserByEmail(email);
  return value;
};

export const updateUserPassword = async (
  email: string,
  password: string,
): Promise<boolean> => {
  const userRecord = await getUserByEmail(email);
  if (!userRecord) {
    throw new Error("User not found");
  }

  await getAuth().updateUser(userRecord.uid, {
    password,
  });

  return true;
};

export const updateUserEmail = async (
  email: string,
  newemail: string,
): Promise<boolean> => {
  const userRecord = await getUserByEmail(email);
  if (!userRecord) {
    throw new Error("User not found");
  }

  await getAuth().updateUser(userRecord.uid, { email: newemail });

  return true;
};

export const deleteFirebaseUser = async (email: string): Promise<boolean> => {
  const userRecord = await getUserByEmail(email);
  console.log("0")
  console.log(userRecord)
  console.log("1")
  if (!userRecord) {
    throw new Error("User not found");
  }

  await getAuth().deleteUser(userRecord.uid);

  return true;
};
