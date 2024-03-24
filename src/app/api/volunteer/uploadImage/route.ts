import APIWrapper from "@server/utils/APIWrapper";
import { Readable } from "stream";



type RequestData = {
  selectedImage: Readable
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    // const requestData = (await req.json()) as RequestData;
    const requestData = (await req.json()) as RequestData;
    if (!requestData.selectedImage ) {
      throw new Error("Missing profile image");
    }
    
    return {
      message: "Hello from Tuan hihihi",
      binaryImage: requestData.selectedImage
    };
  },
});