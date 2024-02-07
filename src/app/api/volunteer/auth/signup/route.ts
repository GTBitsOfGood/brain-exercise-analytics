import { IUser } from "@/common_utils/types";
import { volunteerSignUp } from "@server/mongodb/actions/User";
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
    requireVolunteer: true,
  },
  handler: async (req: Request, currentUser: IUser | undefined) => {
    const signupData = (await req.json()) as SignupData;

    if (!signupData) {
      throw new Error("missing request data");
    }

    if (
      signupData.chapter === undefined ||
      signupData.city === undefined ||
      signupData.country === undefined ||
      signupData.email === undefined ||
      signupData.name === undefined ||
      signupData.phoneNumber === undefined ||
      signupData.state === undefined
    ) {
      throw new Error("Missing parameter(s)");
    }

    if (!currentUser) {
      throw new Error("User not found.");
    }

    if (currentUser.signedUp === true) {
      return currentUser;
    }

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
  },
});
