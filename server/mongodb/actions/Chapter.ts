import { ChapterSearchParams, IChapter, RecursivePartial, SearchResponseBody, SearchRequestBody } from "@/common_utils/types";
import Chapter from "../models/Chapter";
import { flatten } from "mongo-dot-notation";
import { PipelineStage, Promise } from "mongoose";


export const getChapterByName = async (name: string): Promise<IChapter | null> => {
    const chapter = await Chapter.findOne<IChapter>({ name: name });
    return chapter;
  };


export const deleteChapter = async (name: string): Promise<void> => {
    await Chapter.findOneAndDelete({name: name});
}


export const updateChapter = async (
    name: string, 
    newFields: RecursivePartial<IChapter>
): Promise<void> => {
    const flattened = flatten(newFields)

    const chapter = await Chapter.findOneAndUpdate({ name }, flattened, {
        returnDocument: "after"
    });

    return chapter;
}

type ChapParam = {
    name: object;
    chapterPresident?: object;
    patients?: object,
    yearFounded: object,
    "location.country"?: object,
    "location.state"?: object;
    "location.city"?: object;
};


export const getChaptersFiltered = async ({
    params,
    page,
    sortParams,
  }: SearchRequestBody<ChapterSearchParams>) : 
  Promise<SearchResponseBody<IChapter> | undefined> => {

    let newPage = page ?? 0;

    const chapterParamObject = {} as ChapParam;

    if (params.cities) {
        chapterParamObject["location.city"] = { $in: params.cities };
    }
    if (params.states) {
        chapterParamObject["location.city"] = { $in: params.states };
    }
    if (params.countries) {
        chapterParamObject["location.city"] = { $in: params.countries };
    }


    const matchPipeline = {
        $match: { $and: [chapterParamObject] },
      } as PipelineStage.Match;

      
    if (params.yearFounded) {
        matchPipeline.$match.$and!.push({
            $expr: {
              $in: params.yearFounded
            },
        });
    }

    if (params.patients) {
        matchPipeline.$match.$and!.push({
            $expr: {
                $gt: params.patients
            }
        });
    }
 
    if (params.name) {
        matchPipeline.$match.$and?.push({
            $expr: {
                $regexMatch: {
                    input: {
                        $concat: ["$firstName", " ", "$lastName"],
                      },
                    regex: new RegExp(params.name, 'i')
                }
            }
        })
    }



    const chapterFiltering = Chapter.aggregate(
        

    )








    return

    }










    return
  }

