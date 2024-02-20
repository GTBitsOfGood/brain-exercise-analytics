import { IUser, RecursivePartial } from "@/common_utils/types";
import { deleteFirebaseUser, updateUserEmail } from "@server/firebase/utils";
import {
  deleteVolunteer,
  getVolunteer,
  updateVolunteer,
} from "@server/mongodb/actions/Volunteer";
import APIWrapper from "@server/utils/APIWrapper";

export const GET = APIWrapper({
  config: {
    requireToken: false,
    requireVolunteer: false,
  },
  handler: async (req) => {
    const email: string | null = req.nextUrl.searchParams.get("email");
    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const user = await getVolunteer(email);
    return user;
  },
});

type PatchReq = {
  email: string;
  newData: RecursivePartial<IUser>;
};

export const PATCH = APIWrapper({
  config: {
    requireToken: false,
    requireVolunteer: false,
  },
  handler: async (req) => {
    const reqdata: PatchReq = (await req.json()) as PatchReq;
    const { email }: { email: string } = reqdata;
    const { newData } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    if (newData.email !== null && email === newData.email) {
      console.log("here");
      await updateUserEmail(email, newData.email);
    }

    const user = await updateVolunteer(email, newData);
    return user;
  },
});

type DeleteReq = {
  email: string;
};
export const DELETE = APIWrapper({
  config: {
    requireToken: false,
    requireVolunteer: false,
  },
  handler: async (req) => {
    const reqdata: DeleteReq = (await req.json()) as DeleteReq;
    const { email }: { email: string } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    await deleteFirebaseUser(email);
    const user = await deleteVolunteer(email);
    return user;
  },
});
