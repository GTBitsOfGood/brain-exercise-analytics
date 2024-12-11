import APIWrapper from "@server/utils/APIWrapper";
// import User from "@server/mongodb/models/User";
// import { IUser } from "@/common_utils/types";
// import { createAnalyticsID } from "@server/mongodb/actions/Analytics";
// import { sampleUsers, sampleChapters } from "@src/utils/patients";
// import Chapter from "@server/mongodb/models/Chapter";
// import Analytics from "@server/mongodb/models/Analytics";
// import { generateSampleAnalytics } from "@src/utils/analytics";

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

    // function getRandomItem<T>(list: T[]): T {
    // const randomIndex = Math.floor(Math.random() * list.length);
    // return list[randomIndex];
    // }
    // async function deleteOrphanedAnalytics() {
    //   try {
    //     // Step 1: Get all valid user IDs
    //     const validUserIds = await User.distinct("_id");
    //     console.log(validUserIds)

    //     // // Step 2: Delete analytics where `userId` is not in the list of valid user IDs
    //     // const result = await Analytics.deleteMany({
    //     //   userId: { $nin: validUserIds }, // Matches documents with `userId` not in the list
    //     // });

    //     // console.log(`${result.deletedCount} orphaned analytics deleted.`);
    //   } catch (error) {
    //     console.error("Error deleting orphaned analytics:", error);
    //   }
    // }

    // const rolesToSearch = ["Nonprofit Volunteer", "Nonprofit Admin", "Nonprofit Chapter President", "Nonprofit Regional Committee Member"];

    // const volunteers = await User.find({
    //   role: { $in: rolesToSearch },
    // });

    // await Promise.all(
    //   volunteers.map(async (user: IUser) => {
    //     await User.findOneAndUpdate({
    //       _id: user._id
    //     },
    //     {
    //       $set: {chapter: getRandomItem(sampleChapters).name,
    //         role: "Nonprofit Volunteer"
    //       }
    //     }
    //   )
    //   }),
    // );

    // const users = await User.find({
    //   role: "Nonprofit Patient",
    // });

    // const sample = generateSampleAnalytics(users);

    // const newusers = [];

    // await Analytics.deleteMany();
    // await Promise.all(
    //   sample.map(async (sample) => {
    //     await Analytics.create({
    //       userID: sample.userID,
    //       totalSessionsCompleted: sample.totalSessionsCompleted,
    //       active: sample.active,
    //       streak: sample.streak,
    //       lastSessionMetrics: sample.lastSessionMetrics,
    //       weeklyMetrics: sample.weeklyMetrics,
    //     });
    //   }),
    // );

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

    //  const users = await User.insertMany(sampleUsers);
    // await Promise.all(
    //   users.map(async (user: IUser) => {
    //     await createAnalyticsID(user._id);
    //   }),
    // );
    // return null;

    // const chapters = await Chapter.deleteMany();
    // const chapters = await Chapter.insertMany(sampleChapters);
  },
});
