import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { IUser, Role } from "@/common_utils/types";

export const dynamic = "force-dynamic";

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
      newUser = (await User.create({
        email,
        role: Role.NONPROFIT_VOLUNTEER,
      })) as IUser;
    } else if (newUser.role === Role.NONPROFIT_USER) {
      throw new Error("App users cannot sign up on analytics dashboard");
    }

    return newUser;
  },
});
