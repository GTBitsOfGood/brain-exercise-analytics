import {
  IUser,
  RecursivePartial,
  Role,
  SearchRequestBody,
  SearchResponseBody,
  VolunteerSearchParams,
} from "@/common_utils/types";
import { PipelineStage } from "mongoose";
import { flatten } from "mongo-dot-notation";
import User from "../models/User";
import { deleteVerificationLogByEmail } from "./VerificationLog";

type VParam = {
  role?: object;
  approved?: object;
  active?: boolean;
  "location.country"?: object;
  "location.state"?: object;
  "location.city"?: object;
  beiChapter?: object;
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
  SearchResponseBody<IUser[]> | undefined
> => {
  const numOfItems = 8;

  const userParamsObject = {} as VParam;
  if (paramsObject.approved !== undefined) {
    userParamsObject.approved = { $in: paramsObject.approved };
  }

  const allowedAdminRoles = allowedRoles.filter(
    (role) => role !== Role.NONPROFIT_PATIENT,
  );
  userParamsObject.role = {
    $nin: paramsObject.roles
      ? paramsObject.roles.filter((role) => allowedAdminRoles.includes(role))
      : allowedRoles,
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
    userParamsObject.beiChapter = { $in: paramsObject.beiChapters };
  }
  if (paramsObject.active !== undefined) {
    userParamsObject.active = paramsObject.active;
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
  // console.log(userFiltering[0].data[0]);
  return userFiltering[0] as SearchResponseBody<IUser[]> | undefined;
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

  return user;
};

export const deleteVolunteer = async (email: string): Promise<null> => {
  await User.findOneAndDelete({ email });
  await deleteVerificationLogByEmail(email);

  return null;
};

export const postVolunteerImageLink = async (
  email: string,
  newImageLink: string,
): Promise<IUser | null> => {
  const updatedUser: IUser | null = await User.findOneAndUpdate(
    { email },
    { $set: { imageLink: newImageLink } },
    { new: true },
  );
  return updatedUser;
};
