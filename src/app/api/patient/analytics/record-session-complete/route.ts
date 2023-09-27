import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { updateSessionComplete } from "@server/mongodb/actions/Analytics";

type RequestData = {
  email: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqdata: RequestData = (await req.json()) as RequestData;
    const { email } = reqdata;

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
