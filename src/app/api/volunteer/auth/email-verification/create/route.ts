import { createVerificationLog } from "@server/mongodb/actions/VerificationLog";
import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { VerificationLogType } from "@/common_utils/types";
import { sendEmail } from "@server/utils/email";

type RequestData = {
  email: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData || !requestData.email) {
      throw new Error("Missing email in request data");
    }

    const user = await getUserByEmail(requestData.email);

    if (!user) {
      throw new Error("User not found.");
    }
    if (!user.verified) {
      const verificationLog = await createVerificationLog(
        requestData.email,
        VerificationLogType.EMAIL_VERIFICATION,
      );
      const backlinkUrl = `${process.env.URL}/auth/email-verification/${verificationLog.token}`;
      const userEmail = requestData.email;
      await sendEmail(requestData.email, "Email Verification", "verify", {
        backlinkUrl,
        userEmail,
      });
    } else {
      return {
        message: "User already verified.",
        verified: true,
      };
    }

    return {
      message: "Verification email sent.",
      verified: false,
    };
  },
});
