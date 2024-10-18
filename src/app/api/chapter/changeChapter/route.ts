import {
  getVolunteer,
  updateVolunteer,
} from "@server/mongodb/actions/Volunteer";
import APIWrapper from "@server/utils/APIWrapper";

export type PatchReq = {
  email: string;
  chapter: string;
};

export const PATCH = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req, currentUser, updateCookie) => {
    const reqdata: PatchReq = (await req.json()) as PatchReq;
    const { email, chapter }: { email: string; chapter: string } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const testuser = await getVolunteer(email);
    if (!testuser) {
      throw new Error("User does not exist in the database");
    }

    const user = await updateVolunteer(email, { chapter });
    if (user?._id === currentUser?._id) {
      updateCookie?.push({ user: user! });
    }

    return user;
  },
});
