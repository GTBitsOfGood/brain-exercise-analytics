import { getUserByEmail } from "@server/mongodb/actions/User";
import {
  getAnalyticsByID,
  createAnalyticsID,
} from "@server/mongodb/actions/Analytics";
import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { IUser, IAnalytics } from "@/common_utils/types";

export const dynamic = "force-dynamic";

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

    let newUser = await getUserByEmail(email);
    if (newUser === null) {
      newUser = (await User.create({ email })) as IUser;
    }
    let analyticsRecord: IAnalytics = (await getAnalyticsByID(
      newUser._id as string,
    )) as IAnalytics;
    if (analyticsRecord === null) {
      analyticsRecord = await createAnalyticsID(newUser._id as string);
    }
    newUser._id = newUser._id as string;
    return {
      user: newUser,
      gameDetails: {
        streak: analyticsRecord.streak,
        math: {
          difficultyScore:
            analyticsRecord.lastSessionMetrics.math.finalDifficultyScore,
        },
      },
    };
  },
});
