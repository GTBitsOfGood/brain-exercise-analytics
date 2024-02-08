import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { modifyMath } from "@server/mongodb/actions/Analytics";

type RequestData = {
  email: string;
  questionsAttempted: number;
  questionsCorrect: number;
  difficultyScore: number;
  timePerQuestion: number;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqbody: RequestData = (await req.json()) as RequestData;

    const {
      email,
      questionsAttempted,
      questionsCorrect,
      difficultyScore,
      timePerQuestion,
    } = reqbody;

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }
    if (
      questionsAttempted === undefined ||
      questionsAttempted < 0 ||
      questionsCorrect === undefined ||
      questionsCorrect < 0 ||
      difficultyScore === undefined ||
      difficultyScore < 0 ||
      timePerQuestion === undefined ||
      timePerQuestion < 0 ||
      questionsCorrect > questionsAttempted
    ) {
      throw new Error("Parameters are missing or invalid.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
    }

    await modifyMath(
      user._id,
      questionsAttempted,
      questionsCorrect,
      timePerQuestion,
      difficultyScore,
    );

    return null;
  },
});
