import { IChapter, IUser } from "@/common_utils/types";
import {
  aggregatePeople,
  ChapterStatistics,
} from "@server/mongodb/actions/Chapter";
import Chapter from "@server/mongodb/models/Chapter";
import User from "@server/mongodb/models/User";
import APIWrapper from "@server/utils/APIWrapper";
import { ReturnDocument } from "mongodb";
import { ObjectId } from "mongoose";

export type PostReq = {
  name: string;
  chapterPresident: ObjectId;
  yearFounded: number;
  country: string;
  city?: string;
  state?: string;
};

export const POST = APIWrapper({
  config: {
    //   requireToken: true,
    //   requireAdmin: true
  },
  handler: async (req) => {
    const reqData = (await req.json()) as PostReq;

    if (
      !reqData.name ||
      !reqData.chapterPresident ||
      !reqData.yearFounded ||
      !reqData.country
    ) {
      throw Error("Required Fields are missing");
    }

    const president: IUser | null = await User.findById(
      reqData.chapterPresident,
    );
    if (!president) {
      throw Error("Chapter president doesn't exist");
    }

    await Chapter.create({
      name: reqData.name,
      chapterPresident: reqData.chapterPresident,
      yearFounded: reqData.yearFounded,
      location: {
        country: reqData.country,
        state: reqData.state ?? "",
        city: reqData.city ?? "",
      },
    });

    const stats = (await aggregatePeople(reqData.name)) as ChapterStatistics;

    const updateFilter = {
      $set: {
        activeVolunteers: stats.activeVolunteers,
        inactiveVolunteers: stats.inactiveVolunteers,
        patients: stats.patients,
      },
    };

    const newStatsChapter: IChapter | null = await Chapter.findOneAndUpdate(
      { name: reqData.name },
      updateFilter,
      { new: true } );
    return newStatsChapter as IChapter;
  },
});
