import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";

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

    const user = await getUserByEmail(email);
    return user;
  },
});
