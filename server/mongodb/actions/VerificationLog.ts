import { IVerificationLog, VerificationLogType } from "@/common_utils/types";
import VerificationLog from "@server/mongodb/models/VerificationLog";
import { v4 as uuidv4 } from "uuid";

export const createVerificationLog = async (
  email: string,
  type: VerificationLogType,
): Promise<IVerificationLog> => {
  const token: string = uuidv4();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const verificationLog =
    await VerificationLog.findOneAndUpdate<IVerificationLog>(
      {
        email,
        type,
      },
      {
        $set: {
          token,
          expiryDate,
        },
      },
      { upsert: true, new: true },
    );

  return verificationLog;
};

export const getVerificationLogByToken = async (
  token: string,
): Promise<IVerificationLog | null> => {
  const verificationLog: IVerificationLog | null =
    await VerificationLog.findOne<IVerificationLog>({
      token,
    });
  return verificationLog;
};

export const deleteVerificationLogByEmail = async (
  email: string,
): Promise<void> => {
  await VerificationLog.deleteOne({ email });
};

export const deleteVerificationLog = async (
  verificationLog: IVerificationLog,
): Promise<void> => {
  await VerificationLog.deleteOne(verificationLog);
};
