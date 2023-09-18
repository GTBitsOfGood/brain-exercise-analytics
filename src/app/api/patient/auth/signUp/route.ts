import { getUserByEmail, patientSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { SignupData } from "@/common_utils/types";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const signupData = (await req.json()) as SignupData;

    const user = await getUserByEmail(signupData.email);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.patientDetails.signedUp === true) {
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
