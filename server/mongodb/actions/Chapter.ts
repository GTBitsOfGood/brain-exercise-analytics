import { ChapterSearchParams, IChapter, RecursivePartial, SearchResponseBody, SearchRequestBody, IChapterTableEntry } from "@/common_utils/types";
import Chapter from "../models/Chapter";
import { flatten } from "mongo-dot-notation";
import { PipelineStage, Promise } from "mongoose";


export const getChapterByName = async (name: string): Promise<IChapter | null> => {
    const chapter = await Chapter.findOne<IChapter>({ name });
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
    console.log(name)
    const chapter = await Chapter.findOneAndUpdate({ name }, flattened, {
        returnDocument: "after"
    });

    return chapter;
}

type ChapParam = {
    name: object;
    // chapterPresident?: object;
    // patients?: object,
    // yearFounded: object,
    // "location.country"?: object,
    // "location.state"?: object;
    // "location.city"?: object;
};


export const getChaptersFiltered = async ({
    params,
    page,
    sortParams,
  }: SearchRequestBody<ChapterSearchParams>) : 
  Promise<SearchResponseBody<IChapterTableEntry> | undefined> => {

    let newPage = page ?? 0;
    let numOfItems = 11;

    const chapterParamObject = {} as ChapParam;

    // if (params.cities) {
    //     chapterParamObject["location.city"] = { $in: params.cities };
    // }
    // if (params.states) {
    //     chapterParamObject["location.city"] = { $in: params.states };
    // }
    // if (params.countries) {
    //     chapterParamObject["location.city"] = { $in: params.countries };
    // }
    // if (params.yearFounded) {
    //     matchPipeline.$match.$and!.push({
    //         $expr: {
    //           $in: params.yearFounded
    //         },
    //     });
    // }

    // if (params.patients) {
    //     matchPipeline.$match.$and!.push({
    //         $expr: {
    //             $gt: params.patients
    //         }
    //     });
    // }
 
    if (params.name) {
      chapterParamObject.name = {$regex: new RegExp(params.name, 'i')}
    }

    const matchPipeline = {
        $match: { $and: [chapterParamObject] },
      } as PipelineStage.Match;




    const sortPipeline = (
        sortParams
          ? {
              $sort: { [sortParams.field]: sortParams.ascending ? 1 : -1, _id: 1 },
            }
          : {
              $sort: { _id: 1 },
            }
      ) as PipelineStage.Sort;



    const chapterFiltering = await Chapter.aggregate([
        matchPipeline,
        sortPipeline,
        {
            $facet: {
              metadata: [
                { $count: "totalDocuments" },
                {
                  $addFields: {
                    newPage,
                    totalPages: {
                      $ceil: {
                        $divide: ["$totalDocuments", numOfItems],
                      },
                    },
                  },
                },
              ],
              data: [
                { $skip: newPage === undefined ? 0 : numOfItems * newPage },
                { $limit: numOfItems },
              ],
            },
          },
          {
            $unwind: "$metadata"
          },
          {
            $addFields: {
              numRecords: "$metadata.totalDocuments",
              newpage: "$metadata.page",
              numPages: "$metadata.totalPages",
            },
          },
        ]);
        console.log(chapterFiltering)
        

        
        return chapterFiltering[0] as SearchResponseBody<IChapterTableEntry> | undefined;
    };





