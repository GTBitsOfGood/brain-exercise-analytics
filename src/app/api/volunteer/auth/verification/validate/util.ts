import { IVerificationLog } from "@/common_utils/types";
import { getVerificationLogByToken } from "@server/mongodb/actions/VerificationLog";

export async function processRequest({ token }: { token: string | null }) {
  if (!token) {
    throw new Error("Token parameter is missing in the request.");
  }
  const verificationLog: IVerificationLog | null =
    await getVerificationLogByToken(token);
  if (verificationLog === null) {
    throw new Error("Verification log was not found or has expired.");
  }
  return true;
}
