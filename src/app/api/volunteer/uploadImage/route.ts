import APIWrapper from "@server/utils/APIWrapper";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async () => {
    return {
      test: "Hello world",
    };
  },
});