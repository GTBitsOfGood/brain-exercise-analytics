import { getUserByEmail, patientSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { IUser, Role } from "@/common_utils/types";

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
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
      throw new Error("Missing request data");
    }

    if (
      signupData.birthDate === undefined ||
      signupData.email === undefined ||
      signupData.firstName === undefined ||
      signupData.lastName === undefined ||
      signupData.phoneNumber === undefined ||
      signupData.secondaryContactName === undefined ||
      signupData.secondaryContactPhone === undefined
    ) {
      throw new Error("Missing parameter(s)");
    }

    const user = await getUserByEmail(signupData.email);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.signedUp === true) {
      return user;
    }

    const newSignUp = await patientSignUp({
      email: signupData.email,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      phoneNumber: signupData.phoneNumber,
      birthDate: signupData.birthDate.toLocaleDateString(),
      patientDetails: {
        secondaryContactName: signupData.secondaryContactName,
        secondaryContactPhone: signupData.secondaryContactPhone,
        additionalAffiliation: "",
      },
      signedUp: true,
      role: Role.NONPROFIT_PATIENT,
    } as Omit<IUser, "chapter" | "location">);
    return newSignUp;
  },
});
