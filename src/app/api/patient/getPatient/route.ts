import { IUser } from "../../../../../common_utils/types";
import APIWrapper from "../../../../../server/utils/APIWrapper";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const user = req.body._tokenUser as IUser;
    return user;
  },
});
