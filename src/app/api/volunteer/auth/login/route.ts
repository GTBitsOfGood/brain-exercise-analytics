import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { IUser, Role } from "@/common_utils/types";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },

  handler: async (req, _, updateCookie) => {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const keepLoggedString = searchParams.get("keepLogged");

    if (
      !email ||
      (keepLoggedString !== "true" && keepLoggedString !== "false")
    ) {
      throw new Error("Parameter(s) is missing in the request.");
    }

    let newUser = await getUserByEmail(email);
    if (newUser === null) {
      newUser = (await User.create({
        email,
        role: Role.NONPROFIT_VOLUNTEER,
      })) as IUser;
    } else if (newUser.role === Role.NONPROFIT_PATIENT) {
      throw new Error("App users cannot sign up on analytics dashboard");
    }

    const keepLogged = keepLoggedString === "true";
    updateCookie?.push({ user: newUser, keepLogged });

    return newUser;
  },
});
