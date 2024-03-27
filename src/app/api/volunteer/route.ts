import { IUser, RecursivePartial } from "@/common_utils/types";
import { deleteFirebaseUser, updateUserEmail } from "@server/firebase/utils";
import {
  deleteVolunteer,
  getVolunteer,
  updateVolunteer,
} from "@server/mongodb/actions/Volunteer";
import APIWrapper from "@server/utils/APIWrapper";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
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
  newFields: RecursivePartial<IUser>;
};

export const PATCH = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req, _, updatedUserRef) => {
    const reqdata: PatchReq = (await req.json()) as PatchReq;
    const { email }: { email: string } = reqdata;
    const { newFields } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    if (newFields.email !== undefined && email !== newFields.email) {
      const res = await updateUserEmail(email, newFields.email);
      console.log(res);
    }

    const user = await updateVolunteer(email, newFields);
    updatedUserRef?.push(user!);
    return user;
  },
});

type DeleteReq = {
  email: string;
};
export const DELETE = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
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
