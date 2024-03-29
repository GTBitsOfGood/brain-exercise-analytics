import { IVerificationLog } from "@/common_utils/types";
import { verifyUserByEmail } from "@server/mongodb/actions/User";
import {
  deleteVerificationLogByEmail,
  getVerificationLogByToken,
} from "@server/mongodb/actions/VerificationLog";
import APIWrapper from "@server/utils/APIWrapper";

type RequestData = {
  token: string;
};

export const POST = APIWrapper({
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (!requestData.token) {
      throw new Error("Missing token parameter");
    }

    const verificationLog: IVerificationLog | null =
      await getVerificationLogByToken(requestData.token);

    if (!verificationLog) {
      throw new Error("Verification log was not found or has expired.");
    }

    await verifyUserByEmail(verificationLog.email);
    await deleteVerificationLogByEmail(verificationLog.email);

    return {
      success: true,
      message: "Email verification successful.",
    };
  },
});
