import { createVerificationLog } from "@server/mongodb/actions/VerificationLog";
import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { VerificationLogType } from "@/common_utils/types";

type RequestData = {
  email: string;
  name: string;
  type: VerificationLogType;
};

export const POST = APIWrapper({
  config: {},
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (
      !requestData.email ||
      !requestData.type ||
      (requestData.type === VerificationLogType.PASSWORD_RESET &&
        !requestData.name)
    ) {
      throw new Error("Missing parameter(s)");
    }

    const user = await getUserByEmail(requestData.email);

    if (!user) {
      throw new Error("User not found.");
    }

    if (
      requestData.type === VerificationLogType.PASSWORD_RESET &&
      user.name !== requestData.name
    ) {
      throw new Error("Name doesn't match to existing value");
    }

    const verificationLog = await createVerificationLog(
      requestData.email,
      VerificationLogType.PASSWORD_RESET,
    );
    return { token: verificationLog.token };
  },
});
