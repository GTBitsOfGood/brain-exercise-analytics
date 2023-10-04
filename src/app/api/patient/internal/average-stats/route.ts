import APIWrapper from "@server/utils/APIWrapper";
import { averageWeeklyStats } from "@server/mongodb/actions/Analytics";

export const dynamic = "force-dynamic";

type RequestData = {
  secret: string;
};

export const POST = APIWrapper({
  config: {},
  handler: async (req) => {
    const reqdata: RequestData = (await req.json()) as RequestData;
    const { secret } = reqdata;

    if (secret !== process.env.INTERNAL_AVERAGE_SECRET) {
      throw new Error("User is not authorized");
    }

    await averageWeeklyStats();

    return null;
  },
});
