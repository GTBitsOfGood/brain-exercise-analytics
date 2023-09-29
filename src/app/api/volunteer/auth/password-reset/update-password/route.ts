import { IPasswordReset } from "@/common_utils/types";
import { updateUserPassword } from "@server/firebase/passwordReset";
import {
  deletePasswordResetFieldByEmail,
  getPasswordByToken,
} from "@server/mongodb/actions/PasswordReset";
import APIWrapper from "@server/utils/APIWrapper";

type RequestData = {
  token: string;
  password: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (!requestData.token || !requestData.password) {
      throw new Error("Missing parameter(s)");
    }

    const passwordDoc: IPasswordReset | null = await getPasswordByToken(
      requestData.token,
    );

    if (!passwordDoc) {
      throw new Error("Password reset record is not found");
    }

    const value = await updateUserPassword(
      passwordDoc.email,
      requestData.password,
    );
    await deletePasswordResetFieldByEmail(passwordDoc.email);
    return value;
  },
});
