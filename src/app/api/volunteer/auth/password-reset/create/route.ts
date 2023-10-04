import { createPasswordReset } from "@server/mongodb/actions/PasswordReset";
import { getUserByEmail } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";

type RequestData = {
  email: string;
  name: string;
};

export const POST = APIWrapper({
  config: {},
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData) {
      throw new Error("Missing request data");
    }

    if (!requestData.email || !requestData.name) {
      throw new Error("Missing parameter(s)");
    }

    const user = await getUserByEmail(requestData.email);

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.name !== requestData.name) {
      throw new Error("Name doesn't match to existing value");
    }

    await createPasswordReset(requestData.email);
  },
});
