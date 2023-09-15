import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const {
      email, name, phoneNumber, patientDetails,
    } = await req.json();
    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.patientDetails.signedUp === true) {
      return user;
    }

    try {
      const result = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            name,
            phoneNumber,
            patientDetails,
            "patientDetails.signedUp": true,
          },
        },

        { new: true },
      );
      return result;
    } catch (error) {
      throw new Error("couldn't update database.");
    }
  },
});
