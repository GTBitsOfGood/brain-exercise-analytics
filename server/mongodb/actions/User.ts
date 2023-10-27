import { IAnalytics, IUser } from "@/common_utils/types";
import User from "@server/mongodb/models/User";
import Analytics from "../models/Analytics";

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

export const getUsersFiltered = async (
  paramsObject: {
    name?: string;
    dateOfBirth?: string;
    email?: string;
    additionalAffiliation?: string;
    secondName?: string;
    secondaryPhone?: string;
    BEIChapter?: string;
    active?: boolean;
    country?: string;
    state?: string;
    city?: string;
    dateOfJoin?: string;
  },
  page: number,
): Promise<IUser[] | null> => {
  type AParam = {
    startDate?: Date;
    active?: boolean;
  };
  type UParam = {
    name?: string;
    email?: string;
    "patient.birthDate"?: string;
    "patient.secondContactName"?: string;
    "patient.secondaryContactPhone"?: string;
    "location.country"?: string;
    "location.state"?: string;
    "location.city?": string;
    additionalAffiliation?: string;
    BEIChapter?: string;
  };

  const numOfItems = 8;

  const analyticsParamsObject = {} as AParam;

  if (paramsObject.dateOfJoin !== undefined) {
    const dateObject = new Date(paramsObject.dateOfJoin);
    analyticsParamsObject.startDate = dateObject;
  }
  if (paramsObject.active !== undefined) {
    analyticsParamsObject.active = paramsObject.active;
  }

  let patientDOB;
  
  if (paramsObject.dateOfBirth !== undefined) {
    patientDOB = new Date(paramsObject.dateOfBirth);
  }
  console.log(patientDOB)

  const userParamsObject = JSON.parse(
    JSON.stringify({
      name: paramsObject.name,
      email: paramsObject.email,
      "patient.birthDate": patientDOB,
      "patient.secondaryContactName": paramsObject.secondName,
      "patient.secondaryContactPhone": paramsObject.secondaryPhone,
      "location.country": paramsObject.country,
      "location.state": paramsObject.state,
      "location.city": paramsObject.city,
      additionalAffiliation: paramsObject.additionalAffiliation,
      BEIChapter: paramsObject.BEIChapter,
    }),
  ) as UParam;

  console.log(userParamsObject)

  const userFiltering = (await User.find(userParamsObject)
    .skip(numOfItems * page)
    .limit(numOfItems)) as IUser[];

  const userIDs = userFiltering.map((user) => user._id);

  const analyticsFiltering: IAnalytics[] = await Analytics.find({
    ...analyticsParamsObject,
    userID: { $in: userIDs },
  });

  function findOverlappingObjects(
    array1: IUser[],
    array2: IAnalytics[],
  ): IUser[] {
    return array1.filter((obj1) => {
      return array2.some((obj2) => {
        return (
          obj2.userID.toString() === obj1._id?.toString() ||
          !userIDs.includes(obj2.userID)
        );
      });
    });
  }

  const out = findOverlappingObjects(userFiltering, analyticsFiltering);
  return out;
};
