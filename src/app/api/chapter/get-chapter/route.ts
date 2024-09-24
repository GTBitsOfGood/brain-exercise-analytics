import { IChapter, RecursivePartial } from "@/common_utils/types";
import { getChapterByName } from "@server/mongodb/actions/Chapter";
import Chapter from "@server/mongodb/models/Chapter";
import APIWrapper from "@server/utils/APIWrapper";



export const GET = APIWrapper({
    config: { requireVolunteer: true },
    handler: async (req) => {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get("name")

        if (!name) {
            throw new Error("Chapter Name is missing")
        }

        const chapter = await getChapterByName(name);
        return chapter
    }
})



type PatchReq = {
    email: string;
    newFields: RecursivePartial<IChapter>;
  };

export const PATCH = APIWrapper({
    config: { requireAdmin: true },
    handler: async (req) => {
        const reqData: PatchReq = await (req.json()) as PatchReq



    }
})