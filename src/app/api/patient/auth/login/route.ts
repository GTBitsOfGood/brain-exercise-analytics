import { getUserByEmail } from "../../../../../../server/mongodb/actions/User";
import APIWrapper from "../../../../../../server/utils/APIWrapper";
import User from "../../../../../../server/mongodb/models/User";

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
        newUser = await User.create({ email });
      } catch (err) {
        console.log(`Couldn't create new user: ${err}`);
      }
    }

    return newUser;
  },
});
