import { ChapterSearchParams, IChapter, RecursivePartial, SearchRequestBody } from "@/common_utils/types";
import { deleteChapter, getChapterByName, getChaptersFiltered, updateChapter } from "@server/mongodb/actions/Chapter";
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
    name: string;
    newFields: RecursivePartial<IChapter>;
  };

export const PATCH = APIWrapper({
    config: { requireAdmin: true },
    handler: async (req) => {
        const reqData: PatchReq = (await req.json()) as PatchReq
        const { name, newFields }: { name: string, newFields:RecursivePartial<IChapter> } = reqData;

        if (!name) {
            throw new Error("Name is missing")
        }

        const chapter = await getChapterByName(name);
        if (!chapter) {
            throw new Error("No chapter with that name found")
        }

        const updatedChapter = await updateChapter(name, newFields)
        return updatedChapter;
    }
})



type deleteReq = {
    name: string
} 

export const DELETE = APIWrapper({
    config: { requireAdmin: true },
    handler: async (req) => {
        const reqData = await (req.json()) as deleteReq
        const name: string = reqData.name
        
        if (!name) {
            throw new Error("Chapter Name is missing")
        }

        await deleteChapter(name);
    }
})


export const POST = APIWrapper({
    config: { requireAdmin: true },
    handler: async (req) => {
        const reqData = await req.json() as SearchRequestBody<ChapterSearchParams>;

        const params = Object.fromEntries(
            Object.entries(reqData.params).filter(
              ([, val]) =>
                val !== undefined &&
                val !== null &&
                (typeof val !== "string" || val.length > 0) &&
                (val.constructor !== Array || val.length > 0),
            ),
          );

        const chapters = await getChaptersFiltered({
            params,
            page: reqData.page,
            sortParams: reqData.sortParams
        })

        return chapters
    }
});