import { IUser } from "@/common_utils/types";
import User from "@server/mongodb/models/User";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ id });
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
