import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { updateSessionComplete } from "@server/mongodb/actions/Analytics";
import { NextRequest } from "next/server";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req: NextRequest) => {
    const email: string = req.nextUrl.searchParams.get("email") as string;

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
    }

    await updateSessionComplete(user._id!);

    return null;
  },
});
