import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { IUser } from "@/common_utils/types";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },

  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }

    let newUser = await getUserByEmail(email);
    if (newUser === null) {
      try {
        newUser = (await User.create({ email })) as IUser;
      } catch (err) {
        throw new Error("Couldn't create new user");
      }
    }

    return newUser;
  },
});
