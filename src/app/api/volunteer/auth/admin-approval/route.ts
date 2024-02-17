import { IUser, Role, AdminApprovalStatus } from "@/common_utils/types";
import { getUserByEmail, updateUserAdminApproval } from "@server/mongodb/actions/User";
import APIWrapper from "@server/utils/APIWrapper";
import { sendEmail } from "@server/utils/email";

type RequestData = {
  approvedEmail: string;
  approved: boolean;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    roles: [Role.NONPROFIT_ADMIN],
  },
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;

    if (!requestData || !requestData.approvedEmail || requestData.approved === undefined) {
      throw new Error("Invalid request body");
    }

    const user = await getUserByEmail(requestData.approvedEmail);

    if (!user) {
      throw new Error("No account associated with the provided email");
    }

    const updatedApprovalStatus = requestData.approved
      ? AdminApprovalStatus.APPROVED
      : AdminApprovalStatus.REJECTED;
    const userEmail = requestData.approvedEmail;
    await updateUserAdminApproval(userEmail, updatedApprovalStatus);

    const emailSubject = requestData.approved
      ? "Volunteer Application Approved"
      : "Volunteer Application Rejected";
    const backlinkUrl = requestData.approved ? "/patient/search" : ""; 
    const emailContent = updatedApprovalStatus === AdminApprovalStatus.APPROVED
      ? "approved"
      : "denied";

    await sendEmail(userEmail, emailSubject, emailContent, {
      backlinkUrl,
      userEmail,
    });

    return { 
      message: "Volunteer Approval Status Sent",
      approved: true 
    };
  },
});
