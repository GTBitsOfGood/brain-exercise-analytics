import APIWrapper from "@server/utils/APIWrapper";
import { getUserById } from "@server/mongodb/actions/User";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      throw new Error("ID parameter is missing in the request.");
    }

    const user = await getUserById(id);
    return user;
  },
});
