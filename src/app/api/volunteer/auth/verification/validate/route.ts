import APIWrapper from "@server/utils/APIWrapper";
import { processRequest } from "./util";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {},
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const res = await processRequest({ token });
    return res;
  },
});
