import { createVerificationLog } from "@server/mongodb/actions/VerificationLog";
import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { VerificationLogType } from "@/common_utils/types";
import { sendEmail } from "@server/utils/email";

type RequestData = {
  email: string;
  name: string;
};

export const POST = APIWrapper({
  config: {},
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (!requestData.email || !requestData.name) {
      throw new Error("Missing parameter(s)");
    }

    const user = await getUserByEmail(requestData.email);

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.name !== requestData.name) {
      throw new Error("Name doesn't match to existing value");
    }

    const verificationLog = await createVerificationLog(
      requestData.email,
      VerificationLogType.PASSWORD_RESET,
    );

    const backlinkUrl = `${process.env.URL}/auth/password-reset/${verificationLog.token}`;

    const emailSubject = "Password Reset";
    const emailTemplate = "reset";
    await sendEmail(requestData.email, emailSubject, emailTemplate, {
      backlinkUrl,
      userEmail: requestData.email,
    });

    return { token: verificationLog.token };
  },
});
