import { IPasswordReset } from "@/common_utils/types";
import {
  deletePasswordResetField,
  getPasswordByToken,
} from "@server/mongodb/actions/PasswordReset";
import APIWrapper from "@server/utils/APIWrapper";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {},

  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      throw new Error("Token parameter is missing in the request.");
    }
    const passwordResetField: IPasswordReset | null =
      await getPasswordByToken(token);
    const currDate = new Date();
    if (passwordResetField === null) {
      throw new Error("Password reset record was not found");
    }
    if (passwordResetField.expiryDate <= currDate) {
      await deletePasswordResetField(passwordResetField);
      throw new Error("Password reset token has expired.");
    }
    return true;
  },
});
