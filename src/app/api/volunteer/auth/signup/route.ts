import { Role } from "@/common_utils/types";
import { volunteerSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";

type SignupData = {
  signedInEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  chapter: string;
  role?: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req, currentUser, updateCookie) => {
    const signupData = (await req.json()) as SignupData;

    if (!signupData) {
      throw new Error("missing request data");
    }

    if (
      signupData.chapter === undefined ||
      signupData.city === undefined ||
      signupData.country === undefined ||
      signupData.signedInEmail === undefined ||
      signupData.firstName === undefined ||
      signupData.lastName === undefined ||
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
      signupData.signedInEmail,
      signupData.firstName,
      signupData.lastName,
      signupData.phoneNumber,
      signupData.country,
      signupData.state,
      signupData.city,
      signupData.chapter,
      signupData.role || Role.NONPROFIT_VOLUNTEER,
    );

    updateCookie?.push({ user: newSignUp!, keepLogged: false });
    return newSignUp;
  },
});
