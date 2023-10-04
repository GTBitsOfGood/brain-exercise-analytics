import { getUserByEmail, patientSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { IUser, Role } from "@/common_utils/types";

interface SignupData {
  email: string;
  name: string;
  phoneNumber: string;
  birthDate: Date;
  secondaryContactName: string;
  secondaryContactPhone: string;
}

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const signupData: SignupData = (await req.json()) as SignupData;

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
      const newSignUp = await patientSignUp({
        email: signupData.email,
        name: signupData.name,
        phoneNumber: signupData.phoneNumber,
        patientDetails: {
          birthdate: signupData.birthDate.toString(),
          secondaryContactName: signupData.secondaryContactName,
          secondaryContactPhone: signupData.secondaryContactPhone,
        },
        signedUp: true,
        role: Role.NONPROFIT_USER,
      } as IUser);
      return newSignUp;
    } catch (error) {
      console.log(error);
      throw new Error("couldn't update database.");
    }
  },
});
