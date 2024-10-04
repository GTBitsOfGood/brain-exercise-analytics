import { aggregatePeople } from "@server/mongodb/actions/Chapter";
import Chapter from "@server/mongodb/models/Chapter";
import User from "@server/mongodb/models/User";
import APIWrapper from "@server/utils/APIWrapper";
import { match } from "assert";




export const POST = APIWrapper({
    config: {},
    handler: async (req) => {
    const chapterName = (await req.json()) as { chapterName: string };

    if (!chapterName) {
        throw Error("No chapter provided")
    }

    const chapter = Chapter.findOne({ name: chapterName })

    if (!chapter) {
        throw Error("No chapter with that name found");
    }
    console.log(chapterName)

    const chapterStatistics = await aggregatePeople(chapterName.chapterName);
    return chapterStatistics
    }
});