import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { modifyTrivia } from "@server/mongodb/actions/Analytics";

type RequestData = {
  email: string;
  questionsAttempted: number;
  questionsCorrect: number;
  timePerQuestion: number;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqbody: RequestData = (await req.json()) as RequestData;
    const { email, questionsAttempted, questionsCorrect, timePerQuestion } =
      reqbody;

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
    }
    if (
      questionsAttempted === undefined ||
      questionsAttempted < 0 ||
      questionsCorrect === undefined ||
      questionsCorrect < 0 ||
      timePerQuestion === undefined ||
      timePerQuestion < 0 ||
      questionsCorrect > questionsAttempted
    ) {
      throw new Error("Parameters are missing or invalid.");
    }

    // await createAnalyticsID(user._id!)
    await modifyTrivia(
      user._id!,
      questionsAttempted,
      questionsCorrect,
      timePerQuestion,
    );

    return null;
  },
});
