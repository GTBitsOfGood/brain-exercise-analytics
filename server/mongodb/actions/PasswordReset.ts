import { IPasswordReset } from "@/common_utils/types";
import PasswordReset from "@server/mongodb/models/PasswordReset";
import { v4 as uuidv4 } from "uuid";

export const createPasswordReset = async (
  email: string,
): Promise<IPasswordReset> => {
  const token: string = uuidv4();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const passwordReset = await PasswordReset.findOneAndUpdate<IPasswordReset>(
    {
      email,
    },
    {
      $set: {
        token,
        expiryDate,
      },
    },
    { upsert: true, new: true },
  );

  return passwordReset;
};

export const getPasswordByToken = async (
  token: string,
): Promise<IPasswordReset | null> => {
  const password: IPasswordReset | null =
    await PasswordReset.findOne<IPasswordReset>({
      token,
    });
  return password;
};

export const deletePasswordResetFieldByEmail = async (
  email: string,
): Promise<void> => {
  await PasswordReset.deleteOne({ email });
};

export const deletePasswordResetField = async (
  passwordField: IPasswordReset,
): Promise<void> => {
  await PasswordReset.deleteOne(passwordField);
};
