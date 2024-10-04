import {
  IUser,
  RecursivePartial,
  Role,
  SearchRequestBody,
  SearchResponseBody,
  VolunteerSearchParams,
} from "@/common_utils/types";
import { ModifyResult, PipelineStage } from "mongoose";
import { flatten } from "mongo-dot-notation";
import User from "../models/User";
import { deleteVerificationLogByEmail } from "./VerificationLog";
import Chapter from "../models/Chapter";
import { aggregatePeople, ChapterStatistics } from "./Chapter";

type VParam = {
  role?: object;
  approved?: object;
  "adminDetails.active"?: boolean;
  "location.country"?: object;
  "location.state"?: object;
  "location.city"?: object;
  chapter?: object;
  birthDate?: object;
  email?: object;
  joinDate?: object;
};

interface Body<T extends object> extends SearchRequestBody<T> {
  allowedRoles: Role[];
}

export const getVolunteersFiltered = async ({
  params: paramsObject,
  page,
  sortParams,
  allowedRoles,
}: Body<VolunteerSearchParams>): Promise<
  SearchResponseBody<IUser> | undefined
> => {
  const numOfItems = 8;

  const userParamsObject = {} as VParam;
  if (paramsObject.approved !== undefined) {
    userParamsObject.approved = { $in: paramsObject.approved };
  }

  type AdminRoles =
    | Role.NONPROFIT_VOLUNTEER
    | Role.NONPROFIT_ADMIN
    | Role.NONPROFIT_CHAPTER_PRESIDENT
    | Role.NONPROFIT_REGIONAL_COMMITTEE_MEMBER
    | Role.NONPROFIT_DIRECTOR;

  const allowedAdminRoles: AdminRoles[] = allowedRoles.filter(
    (role): role is AdminRoles => role !== Role.NONPROFIT_PATIENT,
  );

  userParamsObject.role = {
    $in: paramsObject.roles
      ? paramsObject.roles.filter((role): role is AdminRoles =>
          allowedAdminRoles.includes(role as AdminRoles),
        )
      : allowedAdminRoles,
  };

  if (paramsObject.emails) {
    userParamsObject.email = { $in: paramsObject.emails };
  }
  if (paramsObject.countries) {
    userParamsObject["location.country"] = { $in: paramsObject.countries };
  }
  if (paramsObject.states) {
    userParamsObject["location.state"] = { $in: paramsObject.states };
  }
  if (paramsObject.cities) {
    userParamsObject["location.city"] = { $in: paramsObject.cities };
  }
  if (paramsObject.beiChapters) {
    userParamsObject.chapter = { $in: paramsObject.beiChapters };
  }
  if (paramsObject.active !== undefined) {
    userParamsObject["adminDetails.active"] = paramsObject.active;
  }

  const matchPipeline = {
    $match: { $and: [userParamsObject] },
  } as PipelineStage.Match;

  if (paramsObject.name) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$firstName", " ", "$lastName"],
          },
          regex: new RegExp(paramsObject.name, `i`),
        },
      },
    });
  }

  if (paramsObject.dateOfBirths) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $in: [
          {
            $dateToString: {
              date: "$birthDate",
              format: "%m-%d-%Y",
            },
          },
          paramsObject.dateOfBirths,
        ],
      },
    });
  }

  if (paramsObject.dateOfJoins) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $in: [
          {
            $dateToString: {
              date: "$startDate",
              format: "%m-%d-%Y",
            },
          },
          paramsObject.dateOfJoins,
        ],
      },
    });
  }

  const sortPipeline = (
    sortParams
      ? {
          $sort: { [sortParams.field]: sortParams.ascending ? 1 : -1, _id: 1 },
        }
      : {
          $sort: { _id: 1 },
        }
  ) as PipelineStage.Sort;

  // console.log(matchPipeline.$match.$and[0].beiChapter)
  const userFiltering = await User.aggregate([
    matchPipeline,
    {
      $project: {
        analyticsRecords: 0,
        __v: 0,
      },
    },
    sortPipeline,
    {
      $facet: {
        metadata: [
          { $count: "totalDocuments" },
          {
            $addFields: {
              page,
              totalPages: {
                $ceil: {
                  $divide: ["$totalDocuments", numOfItems],
                },
              },
            },
          },
        ],
        data: [
          { $skip: page === undefined ? 0 : numOfItems * page },
          { $limit: numOfItems },
        ],
      },
    },
    {
      $unwind: "$metadata",
    },
    {
      $addFields: {
        numRecords: "$metadata.totalDocuments",
        page: "$metadata.page",
        numPages: "$metadata.totalPages",
      },
    },
    {
      $project: {
        metadata: 0,
      },
    },
  ]);
  return userFiltering[0] as SearchResponseBody<IUser> | undefined;
};

export const getVolunteer = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const updateVolunteer = async (
  email: string,
  newData: RecursivePartial<IUser>,
): Promise<IUser | null> => {
  const flattened = flatten(newData);

  const user = await User.findOneAndUpdate<IUser>({ email }, flattened, {
    returnDocument: "after",
  });

  const newStats = (await aggregatePeople(user!.chapter)) as ChapterStatistics;

  if (newData.chapter && newData.adminDetails?.active !== undefined) {
    const oldStats = (await aggregatePeople(user!.chapter)) as ChapterStatistics;

    const newChapter = await Chapter.findOne({ name: newData.chapter });
    
    if (!newChapter) {
      throw Error("Chapter does not exist")
    }

    const updateOldFilter ={
        $set: {
          inactiveVolunteers: oldStats.inactiveVolunteers,
          activeVolunteers: oldStats.activeVolunteers
        }
    };
    
    await Chapter.updateOne({ name: user?.chapter }, updateOldFilter); //Decrease old chapter count

    const updateNewFilter = {
        $set: {
          activeVolunteers: newStats.activeVolunteers,
          inactiveVolunteers: newStats.inactiveVolunteers
        }
    };

    await Chapter.updateOne({ name: newData.chapter }, updateNewFilter); //Increase new chapter count

  } else if (newData.chapter) {
    const newChapter = await Chapter.findOne({ name: newData.chapter });
    const oldStats = (await aggregatePeople(user!.chapter)) as ChapterStatistics;


    if (!newChapter) {
      throw Error("Chapter does not exist")
    }

    
    const updateOldFilter = {
      $set: {
        activeVolunteers: oldStats.activeVolunteers,
        inactiveVolunteers: oldStats.inactiveVolunteers
      }
    };

    await Chapter.updateOne({ name: user?.chapter }, updateOldFilter); //decrease old chapter count

    const updateNewFilter = {
      $set: {
        activeVolunteers: newStats.activeVolunteers,
        inactiveVolunteers: newStats.inactiveVolunteers
      }
    };

    await Chapter.updateOne({ name: newData.chapter }, updateNewFilter); //increase new chapter count

  } else if (newData.adminDetails?.active !== undefined) {

    const updateFilter = {
      $set: {
        activeVolunteers: newStats.activeVolunteers,
        inactiveVolunteers: newStats.inactiveVolunteers
      }
    };

    await Chapter.updateOne({ name: user?.chapter }, updateFilter);
  }

  return user;
};


export const deleteVolunteer = async (email: string): Promise<null> => {
  console.log("HIIII")
  const user = await User.findOneAndDelete({ email }, {returnDocument: 'before'}) as IUser | null;;
  console.log(user)

  await deleteVerificationLogByEmail(email);

  if (user) {
    const chapterName = user.chapter;
    const chapterObject = Chapter.findOne({ name: chapterName });
    const stats = (await aggregatePeople(chapterName)) as ChapterStatistics;

    if (!chapterObject) {
      throw Error("Chapter does not exist")
    }

    const updateFilter = {
        $set: {
          activeVolunteers: stats.activeVolunteers,
          inactiveVolunteers: stats.inactiveVolunteers,
          patients: stats.patients
        }
    }

    await Chapter.updateOne({ name: chapterName }, updateFilter);
  }

  return null;
};
