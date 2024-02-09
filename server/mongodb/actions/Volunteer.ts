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
  name?: RegExp;
  email?: object;
  role: Role;
};

export const getVolunteersFiltered = async ({
  params: paramsObject,
  page,
  sortParams,
}: SearchRequestBody<VolunteerSearchParams>): Promise<
  SearchResponseBody<IUser[]> | undefined
> => {
  const numOfItems = 8;

  const userParamsObject = {
    role:
      paramsObject.role === "Admin"
        ? Role.NONPROFIT_ADMIN
        : Role.NONPROFIT_VOLUNTEER,
  } as VParam;

  // if (paramsObject.name) {
  //   userParamsObject.name = new RegExp(paramsObject.name, `i`);
  // }
  // if (paramsObject.emails) {
  //   userParamsObject.email = { $in: paramsObject.emails };
  // }
  // if (paramsObject.secondaryNames) {
  //   userParamsObject["patientDetails.secondaryContactName"] = {
  //     $in: paramsObject.secondaryNames.map(
  //       (secondaryName) => new RegExp(secondaryName, `i`),
  //     ),
  //   };
  // }
  // if (paramsObject.secondaryPhones) {
  //   userParamsObject["patientDetails.secondaryContactPhone"] = {
  //     $in: paramsObject.secondaryPhones,
  //   };
  // }
  // if (paramsObject.countries) {
  //   userParamsObject["location.country"] = { $in: paramsObject.countries };
  // }
  // if (paramsObject.states) {
  //   userParamsObject["location.state"] = { $in: paramsObject.states };
  // }
  // if (paramsObject.cities) {
  //   userParamsObject["location.city"] = { $in: paramsObject.cities };
  // }
  // if (paramsObject.additionalAffiliations) {
  //   userParamsObject.additionalAffiliation = {
  //     $in: paramsObject.additionalAffiliations,
  //   };
  // }
  // if (paramsObject.beiChapters) {
  //   userParamsObject.beiChapter = { $in: paramsObject.beiChapters };
  // }
  // if (paramsObject.active !== undefined) {
  //   userParamsObject["analyticsRecords.active"] = paramsObject.active;
  // }
  //  if (paramsObject.dateOfBirths) {
  //   matchPipeline.$match.$and!.push({
  //     $expr: {
  //       $in: [
  //         {
  //           $dateToString: {
  //             date: "$patientDetails.birthDate",
  //             format: "%m-%d-%Y",
  //           },
  //         },
  //         paramsObject.dateOfBirths,
  //       ],
  //     },
  //   });
  // }

  // if (paramsObject.dateOfJoins) {
  //   matchPipeline.$match.$and!.push({
  //     $expr: {
  //       $in: [
  //         {
  //           $dateToString: {
  //             date: "$analyticsRecords.startDate",
  //             format: "%m-%d-%Y",
  //           },
  //         },
  //         paramsObject.dateOfJoins,
  //       ],
  //     },
  //   });
  // }

  const matchPipeline = {
    $match: { $and: [userParamsObject] },
  } as PipelineStage.Match;

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
    {
      $lookup: {
        from: "analytics",
        localField: "_id",
        foreignField: "userID",
        as: "analyticsRecords",
      },
    },
    {
      $unwind: {
        path: "$analyticsRecords",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        startDate: "$analyticsRecords.startDate",
        active: "$analyticsRecords.active",
      },
    },
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
  await deleteVerificationLogByEmail(email)


  return null;
};
