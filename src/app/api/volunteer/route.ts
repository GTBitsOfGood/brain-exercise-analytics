import { IUser, RecursivePartial, Role } from "@/common_utils/types";
import { deleteFirebaseUser, updateUserEmail } from "@server/firebase/utils";
import {
  deleteVolunteer,
  getVolunteer,
  updateVolunteer,
} from "@server/mongodb/actions/Volunteer";
import APIWrapper from "@server/utils/APIWrapper";
import { getLowerAdminRoles } from "@src/utils/utils";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req, currentUser) => {
    const email: string | null = req.nextUrl.searchParams.get("email");
    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const lowerRoles: Role[] = getLowerAdminRoles(currentUser!.role);
    const user = await getVolunteer(email);
    if (user === undefined || !lowerRoles.includes(user!.role)) {
      throw new Error(
        "User doesn't exist or you do not have permission to acccess this user",
      );
    }

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
  handler: async (req, currentUser, updatedUserRef) => {
    const reqdata: PatchReq = (await req.json()) as PatchReq;
    const { email }: { email: string } = reqdata;
    const { newFields } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const lowerRoles: Role[] = getLowerAdminRoles(currentUser!.role);
    const testuser = await getVolunteer(email);
    if (testuser === undefined || !lowerRoles.includes(testuser!.role)) {
      throw new Error(
        "User doesn't exist or you do not have permission to acccess this user",
      );
    }

    if (newFields.email !== null && email === newFields.email) {
      await updateUserEmail(email, newFields.email);
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
  handler: async (req, currentUser) => {
    const reqdata: DeleteReq = (await req.json()) as DeleteReq;
    const { email }: { email: string } = reqdata;

    if (!email) {
      throw new Error("Email parameter is missing");
    }

    const lowerRoles: Role[] = getLowerAdminRoles(currentUser!.role);
    const testuser = await getVolunteer(email);
    if (testuser === undefined || !lowerRoles.includes(testuser!.role)) {
      throw new Error(
        "User doesn't exist or you do not have permission to acccess this user",
      );
    }

    await deleteFirebaseUser(email);
    const user = await deleteVolunteer(email);
    return user;
  },
});
