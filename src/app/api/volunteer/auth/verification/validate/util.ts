import { IVerificationLog } from "@/common_utils/types";
import {
  deleteVerificationLog,
  getVerificationLogByToken,
} from "@server/mongodb/actions/VerificationLog";

export async function processRequest({ token }: { token: string | null }) {
  if (!token) {
    throw new Error("Token parameter is missing in the request.");
  }
  const verificationLog: IVerificationLog | null =
    await getVerificationLogByToken(token);
  const currDate = new Date();
  if (verificationLog === null) {
    throw new Error("Verification log was not found");
  }
  if (verificationLog.expiryDate <= currDate) {
    await deleteVerificationLog(verificationLog);
    throw new Error("Password reset token has expired.");
  }
  return true;
}
