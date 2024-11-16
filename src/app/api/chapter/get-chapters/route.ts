import { getChapters } from "@server/mongodb/actions/Chapter";
import APIWrapper from "@server/utils/APIWrapper";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async () => {
    const chapters = await getChapters();

    return chapters;
  },
});
