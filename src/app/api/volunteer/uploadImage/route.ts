import APIWrapper from "@server/utils/APIWrapper";

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async () => {
    return {
      message: "Hello from Tuan",
    };
  },
});