import { IVerificationLog } from "@/common_utils/types";
import {
  deleteVerificationLog,
  getVerificationLogByToken,
} from "@server/mongodb/actions/VerificationLog";
import APIWrapper from "@server/utils/APIWrapper";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {},

  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
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
  },
});
