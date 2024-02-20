import { IVerificationLog } from "@/common_utils/types";
import { updateUserPassword } from "@server/firebase/utils";
import {
  deleteVerificationLogByEmail,
  getVerificationLogByToken,
} from "@server/mongodb/actions/VerificationLog";
import APIWrapper from "@server/utils/APIWrapper";

type RequestData = {
  token: string;
  password: string;
};

export const POST = APIWrapper({
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (!requestData.token || !requestData.password) {
      throw new Error("Missing parameter(s)");
    }

    const verificationLog: IVerificationLog | null =
      await getVerificationLogByToken(requestData.token);

    if (!verificationLog) {
      throw new Error("Verification log was not found or has expired.");
    }

    const value = await updateUserPassword(
      verificationLog.email,
      requestData.password,
    );
    await deleteVerificationLogByEmail(verificationLog.email);
    return value;
  },
});
