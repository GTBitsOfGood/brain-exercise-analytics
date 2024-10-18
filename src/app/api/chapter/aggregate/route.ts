import { IChapter } from "@/common_utils/types";
import { aggregatePeople } from "@server/mongodb/actions/Chapter";
import Chapter from "@server/mongodb/models/Chapter";
import APIWrapper from "@server/utils/APIWrapper";

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const chapterName = (await req.json()) as { chapterName: string };

    if (!chapterName) {
      throw Error("No chapter provided");
    }

    const chapter: IChapter | null = await Chapter.findOne({
      name: chapterName.chapterName,
    });

    if (!chapter) {
      throw Error("No chapter with that name found");
    }

    await aggregatePeople(chapterName.chapterName);
  },
});
