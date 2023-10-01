import { getUserByEmail, patientSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { SignupData } from "@/common_utils/types";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const signupData = (await req.json()) as SignupData;

    if (!signupData) {
      throw new Error("missing request data");
    }

    if (
      !signupData.birthDate ||
      !signupData.email ||
      !signupData.name ||
      !signupData.phoneNumber ||
      !signupData.secondaryContactName ||
      !signupData.secondaryContactPhone
    ) {
      throw new Error("missing parameter(s)");
    }

    const user = await getUserByEmail(signupData.email);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.signedUp === true) {
      return user;
    }

    try {
      const newSignUp = await patientSignUp(signupData);
      return newSignUp;
    } catch (error) {
      throw new Error("couldn't update database.");
    }
  },
});
