import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { modifyWriting } from "@server/mongodb/actions/Analytics";

type RequestData = {
  email: string;
  completed: boolean;
  questionsAnswered: number;
  timePerQuestion: number;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqbody: RequestData = (await req.json()) as RequestData;
    const { email, completed, questionsAnswered, timePerQuestion } = reqbody;

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }
    if (
      completed === undefined ||
      questionsAnswered === undefined ||
      timePerQuestion === undefined
    ) {
      throw new Error("Parameters are missing or invalid.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
    }

    await modifyWriting(
      user._id!,
      completed,
      questionsAnswered,
      timePerQuestion,
    );

    return null;
  },
});
