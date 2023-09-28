import {
  deletePasswordResetField,
  getPasswordByToken,
} from "@server/mongodb/actions/PasswordReset";
import APIWrapper from "@server/utils/APIWrapper";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },

  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      throw new Error("Token parameter is missing in the request.");
    }
    const passwordResetField = await getPasswordByToken(token);
    const currDate = new Date();
    if (passwordResetField === null) {
      throw new Error("Password is pasy its expiry");
    }
    if (passwordResetField.expiryDate < currDate) {
      await deletePasswordResetField(passwordResetField);
    }
    return true;
  },
});
