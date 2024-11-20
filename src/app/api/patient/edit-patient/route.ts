import { getUserByEmail, patientEdit } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { IUser } from "@/common_utils/types";

interface EditData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
}

export const POST = APIWrapper({
  config: {
    requireToken: false,
  },
  handler: async (req) => {
    const editData: EditData = (await req.json()) as EditData;

    if (!editData) {
      throw new Error("Missing request data");
    }

    if (
      editData.birthDate === undefined ||
      editData.email === undefined ||
      editData.firstName === undefined ||
      editData.lastName === undefined ||
      editData.phoneNumber === undefined
    ) {
      throw new Error("Missing parameter(s)");
    }

    const user = await getUserByEmail(editData.email);
    if (!user) {
      throw new Error("User not found.");
    }

    const newSignUp = await patientEdit({
      email: editData.email,
      firstName: editData.firstName,
      lastName: editData.lastName,
      phoneNumber: editData.phoneNumber,
      birthDate: editData.birthDate,
    } as Omit<
      IUser,
      "chapter" | "location" | "patientDetails" | "new" | "signedUp" | "role"
    >);
    return newSignUp;
  },
});
