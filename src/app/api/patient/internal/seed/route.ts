import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { sampleUsers } from "@src/utils/patients";
import { IUser } from "@/common_utils/types";
import { createAnalyticsID } from "@server/mongodb/actions/Analytics";

export const dynamic = "force-dynamic";

type RequestData = {
  secret: string;
};

export const POST = APIWrapper({
  handler: async (req) => {
    const reqdata: RequestData = (await req.json()) as RequestData;
    const { secret } = reqdata;

    if (
      process.env.NODE_ENV === "production" ||
      secret !== process.env.INTERNAL_SECRET
    ) {
      throw new Error("User is not authorized");
    }

    const users = await User.insertMany(sampleUsers);
    await Promise.all(
      users.map(async (user: IUser) => {
        await createAnalyticsID(user._id);
      }),
    );

    return null;
  },
});
