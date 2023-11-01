import { IAnalytics, IUser } from "@/common_utils/types";
import User from "@server/mongodb/models/User";
import Analytics from "../models/Analytics";
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
  name?: string;
  email?: object;
  "patientDetails.birthDate"?: object;
  "patientDetails.secondaryContactName"?: object;
  "patientDetails.secondaryContactPhone"?: object;
  "location.country"?: object;
  "location.state"?: object;
  "location.city"?: object;
  additionalAffiliation?: object;
  beiChapter?: object;
  'analyticsRecords.active'?: boolean;
};

export const getUsersFiltered = async (
  paramsObject: {
    name?: string;
    dateOfBirth?: string[];
    email?: string[];
    additionalAffiliation?: string[];
    secondName?: string[];
    secondaryPhone?: string[];
    beiChapter?: string[];
    active?: boolean;
    country?: string[];
    state?: string[];
    city?: string[];
    dateOfJoin?: string[];
  },
  page: number,
): Promise<IUser[] | null> => {


  const numOfItems = 8;


  if (paramsObject.dateOfJoin !== undefined) {
  //   const patientDate = new Date(paramsObject.dateOfJoin);
  //   const patientDate2 = new Date(patientDate);
  //   patientDate2.setDate(patientDate.getDate() + 1);
  //   const startDateParam = { $gte: patientDate, $lt: patientDate };

  //   analyticsParamsObject.startDate = startDateParam;
  }

  

  const userParamsObject = {} as UParam
  if (paramsObject.name) {
    userParamsObject.name = paramsObject.name
  }
  if (paramsObject.email) {
    userParamsObject.email = {"$in": paramsObject.email}
  }
  if (paramsObject.secondName) {
    userParamsObject["patientDetails.secondaryContactName"] = {"$in": paramsObject.secondName}
  }
  if (paramsObject.secondaryPhone) {
    userParamsObject["patientDetails.secondaryContactPhone"] = {"$in": paramsObject.secondaryPhone}
  }
  if (paramsObject.country) {
    userParamsObject["location.country"] = {"$in": paramsObject.country}
  }
  if (paramsObject.state) {
    userParamsObject["location.state"] = {"$in": paramsObject.state}
  }
  if (paramsObject.city) {
    userParamsObject["location.city"] = {"$in": paramsObject.city}
  }
  if (paramsObject.additionalAffiliation) {
    userParamsObject.additionalAffiliation = {"$in": paramsObject.additionalAffiliation}
  }
  if (paramsObject.beiChapter) {
    userParamsObject.beiChapter = {"$in": paramsObject.beiChapter}
  }
  if (paramsObject.active) {
    userParamsObject['analyticsRecords.active'] = paramsObject.active
  }



  let matchPipeline = 
    { $match: {$and: 
      [userParamsObject]} } as PipelineStage.Match;
  
  if (paramsObject.dateOfBirth) {
    matchPipeline['$match']['$and']!.push({$expr: {
                $in: [
                  {
                    $dateToString: {
                      date: "$patientDetails.birthDate",
                      format: "%m-%d-%Y"
                    }
                  },
                  paramsObject.dateOfBirth
                ]
              }})
  }

  if (paramsObject.dateOfJoin) {
    matchPipeline['$match']['$and']!.push({$expr: {
                $in: [
                  {
                    $dateToString: {
                      date: "$analyticsRecords.startDate", 
                      format: "%m-%d-%Y"
                    }
                  },
                  paramsObject.dateOfJoin
                ]
              }})
  }


  console.log(matchPipeline)

  const userFiltering = (await User.aggregate([
    {$lookup: {
      from: "analytics",
      localField: "_id",
      foreignField: "userID",
      as: "analyticsRecords"
    }},
    {
      $unwind: "$analyticsRecords"
    },
    matchPipeline,
    {$project: {
      'analyticsRecords._id': 0,
      'analyticsRecords.userID': 0,
      'analyticsRecords.totalSessionsCompleted': 0,
      'analyticsRecords.streak': 0,
      'analyticsRecords.lastSessionMetrics': 0,
      'analyticsRecords.weeklyMetrics': 0,
      'analyticsRecords.__v': 0,
      '__v': 0
      }
    }
    ]
    ).skip(numOfItems * page)
    .limit(numOfItems)) as IUser[];

  console.log(userFiltering)

  const out = userFiltering;
  return out;
};
