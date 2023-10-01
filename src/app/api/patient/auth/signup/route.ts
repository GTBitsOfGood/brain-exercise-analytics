import { getUserByEmail, patientSignUp } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { IUser } from "@/common_utils/types";
import { NextRequest } from "next/server";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req: NextRequest) => {
    const signupData: Partial<IUser> = {
      email: req.nextUrl.searchParams.get("email") ?? undefined,
      name: req.nextUrl.searchParams.get("name") ?? undefined,
      phoneNumber: req.nextUrl.searchParams.get("phoneNumber") ?? undefined,
      patientDetails: {
        birthdate:
          req.nextUrl.searchParams.get("patientDetails[birthdate]") ??
          undefined,
        secondaryContactName:
          req.nextUrl.searchParams.get(
            "patientDetails[secondaryContactName]",
          ) ?? undefined,
        secondaryContactPhone: req.nextUrl.searchParams.get(
          "patientDetails[secondaryContactPhone]",
        ),
      },
      signedUp: req.nextUrl.searchParams.get("signedUp"),
      role: req.nextUrl.searchParams.get("role"),
    };

    if (!signupData) {
      throw new Error("missing request data");
    }

    if (
      !signupData.email ||
      !signupData.name ||
      !signupData.phoneNumber ||
      !signupData?.patientDetails.birthdate ||
      !signupData?.patientDetails.secondaryContactName ||
      !signupData?.patientDetails.secondaryContactPhone
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
