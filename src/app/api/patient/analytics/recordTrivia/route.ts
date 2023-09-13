import APIWrapper from "@server/utils/APIWrapper";
import { getUserByEmail } from "@server/mongodb/actions/User";
import { modifyTrivia } from "@server/mongodb/actions/Analytics";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const { email, questionsAttempted, questionsCorrect, timePerQuestion } =
      await req.json();

    if (!email) {
      throw new Error("Email parameter is missing in the request.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found in the database.");
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
