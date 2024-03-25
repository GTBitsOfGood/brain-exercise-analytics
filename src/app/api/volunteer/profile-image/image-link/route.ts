import APIWrapper from "@server/utils/APIWrapper";
import {
  postVolunteerImageLink,
} from "@server/mongodb/actions/Volunteer";

type postRequest = {
  newImageLink: string;
  email: string
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
      const requestData = (await req.json()) as postRequest;
      const email = requestData.email
      const newImageLink = requestData.newImageLink
      if (!requestData ) {
      throw new Error("Missing request data");
    }
    if (!email) {
      throw new Error("Missing image link in request data");
    }
    if (!newImageLink) {
      throw new Error("Missing image link in request data");
    }
    const user = await postVolunteerImageLink(email, newImageLink)

    return user
  },
});

export const PUT = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async () => {
    return {
      message: "from PUT image link api",
    };
  },
});