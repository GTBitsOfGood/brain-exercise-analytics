import { IUser } from "@/common_utils/types";
import User from "@server/mongodb/models/User";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne<IUser>({ email });
  return user;
};

export const createUserEmail = async (email: string): Promise<IUser> => {
  const user: IUser = await User.create({ email });
  return user;
};
