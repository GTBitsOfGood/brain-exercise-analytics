import {
  AdminApprovalStatus,
  IChapter,
  IPatientTableEntry,
  IUser,
  PatientSearchParams,
  Role,
  SearchRequestBody,
  SearchResponseBody,
} from "@/common_utils/types";
import User from "@server/mongodb/models/User";
import { PipelineStage } from "mongoose";
import Chapter from "../models/Chapter";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ _id: id });
  return user;
};

export const updateUserAdminApproval = async (
  email: string,
  approvalStatus: AdminApprovalStatus,
): Promise<IUser | null> => {
  try {
    const updatedUser = await User.findOneAndUpdate<IUser>(
      { email },
      {
        $set: {
          approved: approvalStatus,
        },
      },
    );

    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update admin approval status");
  }
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
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        patientDetails: {
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
  firstName: string,
  lastName: string,
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
        firstName,
        lastName,
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

  const chapterObject: IChapter | null = await Chapter.findOne({
    name: chapter,
  });
  if (!chapterObject) {
    throw Error("Chapter does not exist");
  }
  const updateFilter = {
    $inc: {
      activeVolunteers: 1,
    },
  };

  await Chapter.updateOne({ name: chapter }, updateFilter);
  return result;
};
type UParam = {
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
  searchall,
  onlyids,
}: SearchRequestBody<PatientSearchParams>): Promise<
  SearchResponseBody<IPatientTableEntry> | undefined
> => {
  let numOfItems = 8;
  let newpage = page;

  if (page === undefined) {
    newpage = 0;
  }
  if (searchall) {
    numOfItems = Number.MAX_SAFE_INTEGER;
    newpage = 0;
  }

  const userParamsObject = {
    role: Role.NONPROFIT_PATIENT,
  } as UParam;

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

  let overallProjects: object = {
    analyticsRecords: 0,
    __v: 0,
  };
  if (onlyids) {
    overallProjects = {
      analyticsRecords: 0,
      __v: 0,
      phoneNumber: 0,
      email: 0,
      patientDetails: 0,
      adminDetails: 0,
      chapter: 0,
      location: 0,
      signedUp: 0,
      verified: 0,
      approved: 0,
      role: 0,
      startDate: 0,
    };
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
        active: "$analyticsRecords.active",
      },
    },
    matchPipeline,
    {
      $project: overallProjects,
    },
    sortPipeline,
    {
      $facet: {
        metadata: [
          { $count: "totalDocuments" },
          {
            $addFields: {
              newpage,
              totalPages: {
                $ceil: {
                  $divide: ["$totalDocuments", numOfItems],
                },
              },
            },
          },
        ],
        data: [
          { $skip: newpage === undefined ? 0 : numOfItems * newpage },
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
        newpage: "$metadata.page",
        numPages: "$metadata.totalPages",
      },
    },
    {
      $project: {
        metadata: 0,
      },
    },
  ]);

  return userFiltering[0] as SearchResponseBody<IPatientTableEntry> | undefined;
};
