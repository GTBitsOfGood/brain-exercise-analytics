import APIWrapper from "@server/utils/APIWrapper";


type RequestData = {
  newImageLink: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
      const requestData = (await req.json()) as RequestData;
      if (!requestData ) {
      throw new Error("Missing request data");
    }
    if (!requestData.newImageLink) {
      throw new Error("Missing image link in request data");
    }
    return {
      message: "from POST image link api",
      imageLinkThatStored: requestData.newImageLink
    };
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