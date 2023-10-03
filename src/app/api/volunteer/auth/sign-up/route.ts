import { Role } from "@/common_utils/types";
import { getUserByEmail, volunteerSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";

type SignupData = {
  email: string;
  name: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  chapter: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    roles: [Role.NONPROFIT_ADMIN, Role.NONPROFIT_VOLUNTEER],
  },
  handler: async (req: Request) => {
    const signupData = (await req.json()) as SignupData;

    if (!signupData) {
      throw new Error("missing request data");
    }

    if (
      !signupData.chapter ||
      !signupData.city ||
      !signupData.country ||
      !signupData.email ||
      !signupData.name ||
      !signupData.phoneNumber ||
      !signupData.state
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
      const newSignUp = await volunteerSignUp(
        signupData.email,
        signupData.name,
        signupData.phoneNumber,
        signupData.country,
        signupData.state,
        signupData.city,
        signupData.chapter,
      );
      return newSignUp;
    } catch (error) {
      throw new Error("couldn't update database.");
    }
  },
});
