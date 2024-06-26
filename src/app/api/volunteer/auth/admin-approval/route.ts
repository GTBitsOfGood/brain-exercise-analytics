import { deleteFirebaseUser } from "@server/firebase/utils";
import { AdminApprovalStatus, Role } from "@/common_utils/types";
import {
  getUserByEmail,
  updateUserAdminApproval,
} from "@server/mongodb/actions/User";
import User from "@server/mongodb/models/User";
import APIWrapper from "@server/utils/APIWrapper";
import { sendEmail } from "@server/utils/email";
import { getLowerAdminRoles } from "@src/utils/utils";

type RequestData = {
  approvedEmail: string;
  approved: boolean;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req, currentUser) => {
    const requestData = (await req.json()) as RequestData;

    if (
      !requestData ||
      !requestData.approvedEmail ||
      requestData.approved === undefined
    ) {
      throw new Error("Invalid request body");
    }

    const user = await getUserByEmail(requestData.approvedEmail);
    if (!user) {
      throw new Error("No account associated with the provided email");
    }
    const lowerRoles: Role[] = getLowerAdminRoles(currentUser!.role);
    if (!lowerRoles.includes(user.role)) {
      throw new Error(
        "This account is not allowed to modify the features of the provided email",
      );
    }

    const updatedApprovalStatus = requestData.approved
      ? AdminApprovalStatus.APPROVED
      : AdminApprovalStatus.REJECTED;
    const userEmail = requestData.approvedEmail;

    await updateUserAdminApproval(userEmail, updatedApprovalStatus);

    const emailSubject = requestData.approved
      ? "Volunteer Application Approved"
      : "Volunteer Application Rejected";
    const backlinkUrl =
      process.env.URL +
      (requestData.approved ? "/patient/search" : "/auth/login");
    const emailContent = `admin-approval/${
      updatedApprovalStatus === AdminApprovalStatus.APPROVED
        ? "approved"
        : "denied"
    }`;

    if (requestData.approved === false) {
      await deleteFirebaseUser(requestData.approvedEmail);
      await User.deleteOne({ email: requestData.approvedEmail });
    }

    await sendEmail(userEmail, emailSubject, emailContent, {
      backlinkUrl,
      userEmail,
    });

    return {
      message: "Volunteer Approval Status Sent",
      approved: requestData.approved,
    };
  },
});
