import {
  IPatientTableEntry,
  IUser,
  PatientSearchParams,
  Role,
  SearchRequestBody,
  SearchResponseBody,
} from "@/common_utils/types";
import User from "@server/mongodb/models/User";
import { PipelineStage } from "mongoose";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ _id: id });
  return user;
};

export const verifyUserByEmail = async (
  email: string,
): Promise<IUser | null> => {
  const res = await User.findOneAndUpdate<IUser>(
    { email },
    {
      $set: {
        verified: true,
      },
    },
  );
  return res;
};

export const createUserEmail = async (email: string): Promise<IUser> => {
  const user = (await User.create({ email })) as IUser;
  return user;
};

export const patientSignUp = async (
  data: Omit<IUser, "chapter" | "location">,
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate<IUser>(
    { email: data.email },
    {
      $set: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        patientDetails: {
          birthDate: data.patientDetails.birthDate,
          secondaryContactName: data.patientDetails.secondaryContactName,
          secondaryContactPhone: data.patientDetails.secondaryContactPhone,
        },
        signedUp: true,
      },
    },

    { new: true },
  );
  return result;
};

export const volunteerSignUp = async (
  email: string,
  name: string,
  phoneNumber: string,
  country: string,
  state: string,
  city: string,
  chapter: string,
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate<IUser>(
    { email },
    {
      $set: {
        name,
        phoneNumber,
        signedUp: true,
        location: {
          country,
          state,
          city,
        },
        chapter,
      },
    },

    { new: true },
  );
  return result;
};

type UParam = {
  name?: RegExp;
  email?: object;
  role: Role;
  "patientDetails.birthDate"?: object;
  "patientDetails.secondaryContactName"?: object;
  "patientDetails.secondaryContactPhone"?: object;
  "location.country"?: object;
  "location.state"?: object;
  "location.city"?: object;
  additionalAffiliation?: object;
  beiChapter?: object;
  "analyticsRecords.active"?: boolean;
};

export const getUsersFiltered = async ({
  params: paramsObject,
  page,
  sortParams,
}: SearchRequestBody<PatientSearchParams>): Promise<
  SearchResponseBody<IPatientTableEntry[]> | undefined
> => {
  const numOfItems = 8;

  const userParamsObject = {
    role: Role.NONPROFIT_PATIENT,
  } as UParam;

  if (paramsObject.name) {
    userParamsObject.name = new RegExp(paramsObject.name, `i`);
  }
  if (paramsObject.emails) {
    userParamsObject.email = { $in: paramsObject.emails };
  }
  if (paramsObject.secondaryNames) {
    userParamsObject["patientDetails.secondaryContactName"] = {
      $in: paramsObject.secondaryNames.map(
        (secondaryName) => new RegExp(secondaryName, `i`),
      ),
    };
  }
  if (paramsObject.secondaryPhones) {
    userParamsObject["patientDetails.secondaryContactPhone"] = {
      $in: paramsObject.secondaryPhones,
    };
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
  if (paramsObject.additionalAffiliations) {
    userParamsObject.additionalAffiliation = {
      $in: paramsObject.additionalAffiliations,
    };
  }
  if (paramsObject.beiChapters) {
    userParamsObject.beiChapter = { $in: paramsObject.beiChapters };
  }
  if (paramsObject.active !== undefined) {
    userParamsObject["analyticsRecords.active"] = paramsObject.active;
  }

  const matchPipeline = {
    $match: { $and: [userParamsObject] },
  } as PipelineStage.Match;

  if (paramsObject.dateOfBirths) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $in: [
          {
            $dateToString: {
              date: "$patientDetails.birthDate",
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
              date: "$analyticsRecords.startDate",
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
        data: [{ $skip: numOfItems * page }, { $limit: numOfItems }],
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
  return userFiltering[0] as
    | SearchResponseBody<IPatientTableEntry[]>
    | undefined;
};
