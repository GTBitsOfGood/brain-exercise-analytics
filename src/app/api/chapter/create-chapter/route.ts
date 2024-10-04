import { IUser, IAnalytics } from "@/common_utils/types";
import { getAnalyticsByID, createAnalyticsID } from "@server/mongodb/actions/Analytics";
import { aggregatePeople, ChapterStatistics } from "@server/mongodb/actions/Chapter";
import { incrementTotalUsers } from "@server/mongodb/actions/OverallAnalytics";
import { getUserByEmail } from "@server/mongodb/actions/User";
import Chapter from "@server/mongodb/models/Chapter";
import User from "@server/mongodb/models/User";
import APIWrapper from "@server/utils/APIWrapper";
import { ObjectId } from "mongoose";


export type PostReq = {
    name: string,
    chapterPresident: ObjectId,
    yearFounded: number,
    country: string,
    city?: string,
    state?: string
}

export const POST = APIWrapper({
    config: { 
    //   requireToken: true,
    //   requireAdmin: true 
    },
    handler: async (req) => {
    const reqData = (await req.json()) as PostReq;

    if (!reqData.name ||
    !reqData.chapterPresident ||
    !reqData.yearFounded ||
    !reqData.country)
    {
    throw Error("Required Fields are missing");
    }

    const president = User.findById(reqData.chapterPresident);
    if (!president) {
    throw Error("Chapter president doesn't exist");
    }

    const newChapter = await Chapter.create({
    name: reqData.name,
    chapterPresident: reqData.chapterPresident,
    yearFounded: reqData.yearFounded,
    location: {
        country: reqData.country,
        state: reqData.state ?? "",
        city: reqData.city ?? "",
    }
    })

    const stats = (await aggregatePeople(reqData.name)) as ChapterStatistics;


    const updateFilter = {
            $set: {
            activeVolunteers: stats.activeVolunteers,
            inactiveVolunteers: stats.inactiveVolunteers,
            patients: stats.patients
            }
        }

    await Chapter.updateOne({ name: reqData.name }, updateFilter);
    const newStatsChapter = await Chapter.findOne({ name: reqData.name });
    return newStatsChapter;
    },
  });
  