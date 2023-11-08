import { IFilteredUser, IUser } from "@/common_utils/types";
import User from "@server/mongodb/models/User";
import { PipelineStage } from "mongoose";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const createUserEmail = async (email: string): Promise<IUser> => {
  const user = (await User.create({ email })) as IUser;
  return user;
};

export const patientSignUp = async (data: IUser): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate<IUser>(
    { email: data.email },
    {
      $set: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        patientDetails: {
          birthDate: data.patientDetails.birthdate,
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

export const getUsersFiltered = async (
  paramsObject: {
    name?: string;
    dateOfBirth?: string[];
    email?: string[];
    additionalAffiliation?: string[];
    secondName?: string;
    secondaryPhone?: string[];
    beiChapter?: string[];
    active?: boolean;
    country?: string[];
    state?: string[];
    city?: string[];
    dateOfJoin?: string[];
  },
  page: number,
  sortParams?: {
    value?: string;
    ascending?: boolean;
  },
): Promise<IFilteredUser | null> => {
  const numOfItems = 8;

  const userParamsObject = {} as UParam;
  if (paramsObject.name) {
    userParamsObject.name = new RegExp(`^${paramsObject.name}`, `i`);
  }
  if (paramsObject.email) {
    userParamsObject.email = { $in: paramsObject.email };
  }
  if (paramsObject.secondName) {
    userParamsObject["patientDetails.secondaryContactName"] = new RegExp(
      `^${paramsObject.secondName}`,
      `i`,
    );
  }
  if (paramsObject.secondaryPhone) {
    userParamsObject["patientDetails.secondaryContactPhone"] = {
      $in: paramsObject.secondaryPhone,
    };
  }
  if (paramsObject.country) {
    userParamsObject["location.country"] = { $in: paramsObject.country };
  }
  if (paramsObject.state) {
    userParamsObject["location.state"] = { $in: paramsObject.state };
  }
  if (paramsObject.city) {
    userParamsObject["location.city"] = { $in: paramsObject.city };
  }
  if (paramsObject.additionalAffiliation) {
    userParamsObject.additionalAffiliation = {
      $in: paramsObject.additionalAffiliation,
    };
  }
  if (paramsObject.beiChapter) {
    userParamsObject.beiChapter = { $in: paramsObject.beiChapter };
  }
  if (paramsObject.active) {
    userParamsObject["analyticsRecords.active"] = paramsObject.active;
  }

  const matchPipeline = {
    $match: { $and: [userParamsObject] },
  } as PipelineStage.Match;

  if (paramsObject.dateOfBirth) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $in: [
          {
            $dateToString: {
              date: "$patientDetails.birthDate",
              format: "%m-%d-%Y",
            },
          },
          paramsObject.dateOfBirth,
        ],
      },
    });
  }

  if (paramsObject.dateOfJoin) {
    matchPipeline.$match.$and!.push({
      $expr: {
        $in: [
          {
            $dateToString: {
              date: "$analyticsRecords.startDate",
              format: "%m-%d-%Y",
            },
          },
          paramsObject.dateOfJoin,
        ],
      },
    });
  }

  let sortPipeline = {} as PipelineStage.Sort;
  if (sortParams) {
    sortPipeline = {
      $sort: { [sortParams.value!]: sortParams.ascending! ? -1 : 1, _id: 1 },
    } as PipelineStage.Sort;
  }

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
  ]);

  return userFiltering[0] as IFilteredUser;
};
