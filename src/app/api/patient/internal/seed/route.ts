import APIWrapper from "@server/utils/APIWrapper";
import User from "@server/mongodb/models/User";
import { IUser } from "@/common_utils/types";
import { createAnalyticsID } from "@server/mongodb/actions/Analytics";
import Analytics from "@server/mongodb/models/Analytics";
import { sampleUsers } from "@src/utils/patients";
import mongoose from "mongoose";

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

    const users = await User.find({
      role: "Nonprofit Patient",
    });
    await Promise.all(
      users.map(async (user: IUser) => {
        await createAnalyticsID(user._id);
      }),
    );
    // for (let i = 10000; i < 11000; i++) {
    //   await Promise.all(
    //     sampleUsers.map(async (user: IUser) => {
    //       let deluser = await User.findOneAndDelete<IUser>({
    //         email: user.email
    //       })
    //       if (deluser != undefined) {
    //         await Analytics.deleteOne({
    //         userID: new mongoose.Types.ObjectId(deluser._id)
    //       })
    //       }
    //     })
    //   )
    // }

    // const users = await User.insertMany(sampleUsers);
    // await Promise.all(
    //   users.map(async (user: IUser) => {
    //     await createAnalyticsID(user._id);
    //   }),
    // );

    return null;
  },
});
