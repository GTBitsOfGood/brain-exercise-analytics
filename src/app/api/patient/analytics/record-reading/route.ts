import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { modifyReading } from "@server/mongodb/actions/Analytics";

type RequestData = {
  email: string;
  completed: boolean;
  passagesRead: number;
  timePerPassage: number;
  wordsPerMinute: number;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqbody: RequestData = (await req.json()) as RequestData;
    const { email, completed, passagesRead, timePerPassage, wordsPerMinute } =
      reqbody;

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }
    if (
      completed === undefined ||
      passagesRead === undefined ||
      timePerPassage === undefined ||
      wordsPerMinute === undefined ||
      passagesRead < 0
    ) {
      throw new Error("Parameters are missing or invalid.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
    }

    await modifyReading(
      user._id,
      completed,
      passagesRead,
      timePerPassage,
      wordsPerMinute,
    );

    return null;
  },
});
