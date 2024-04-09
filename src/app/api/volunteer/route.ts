import { IUser, RecursivePartial } from "@/common_utils/types";
import { deleteFirebaseUser, updateUserEmail } from "@server/firebase/utils";
import {
  deleteVolunteer,
  getVolunteer,
  updateVolunteer,
} from "@server/mongodb/actions/Volunteer";
import APIWrapper from "@server/utils/APIWrapper";
import { checkValidUserPermissions } from "@server/utils/utils";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req, currentUser, updateCookie) => {
    const email: string | null = req.nextUrl.searchParams.get("email");
    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const user = await getVolunteer(email);
    if (!user) {
      throw new Error("User does not exist in the database");
    }
    if (!checkValidUserPermissions(currentUser!, user)) {
      throw new Error("You do not have permission to acccess this user");
    }

    updateCookie?.push({ user });

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
  handler: async (req, currentUser, updateCookie) => {
    const reqdata: PatchReq = (await req.json()) as PatchReq;
    const { email }: { email: string } = reqdata;
    const { newFields } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const testuser = await getVolunteer(email);
    if (!testuser) {
      throw new Error("User does not exist in the database");
    }
    if (!checkValidUserPermissions(currentUser!, testuser)) {
      throw new Error("You do not have permission to acccess this user");
    }

    if (newFields.email !== null && email === newFields.email) {
      await updateUserEmail(email, newFields.email);
    }

    const user = await updateVolunteer(email, newFields);
    updateCookie?.push({ user: user! });
    return user;
  },
});

type DeleteReq = {
  email: string;
};
export const DELETE = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req, currentUser) => {
    const reqdata: DeleteReq = (await req.json()) as DeleteReq;
    const { email }: { email: string } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const testuser = await getVolunteer(email);
    if (!testuser) {
      throw new Error("User does not exist in the database");
    }
    if (!checkValidUserPermissions(currentUser!, testuser)) {
      throw new Error("You do not have permission to acccess this user");
    }

    await deleteFirebaseUser(email);
    const user = await deleteVolunteer(email);
    return user;
  },
});
