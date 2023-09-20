import { IUser, SignupData } from "@/common_utils/types";
import User from "@server/mongodb/models/User";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const createUserEmail = async (email: string): Promise<IUser> => {
  const user: IUser = await User.create({ email });
  return user;
};

export const patientSignUp = async (
  data: SignupData,
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate<IUser>(
    { email: data.email },
    {
      $set: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        patientDetails: {
          birthDate: data.birthDate,
          secondaryContactName: data.secondaryContactName,
          secondaryContactPhone: data.secondaryContactPhone,
          signedUp: true,
        },
      },
    },

    { new: true },
  );
  return result;
};
