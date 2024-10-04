import {
  ChapterSearchParams,
  IChapter,
  RecursivePartial,
  SearchResponseBody,
  SearchRequestBody,
  IChapterTableEntry,
} from "@/common_utils/types";
import { flatten } from "mongo-dot-notation";
import { PipelineStage, Promise } from "mongoose";
import Chapter from "../models/Chapter";
import User from "../models/User";
import { SystemSecurityUpdate } from "@mui/icons-material";
import { Db } from "mongodb";

export const getChapterByName = async (
  name: string,
): Promise<IChapter | null> => {
  const chapter = await Chapter.findOne<IChapter>({ name });
  return chapter;
};

export const deleteChapter = async (name: string): Promise<void> => {
  await Chapter.findOneAndDelete({ name });
};

export const updateChapter = async (
  name: string,
  newFields: RecursivePartial<IChapter>,
): Promise<IChapter | void> => {
  const flattened = flatten(newFields);
  const chapter = (await Chapter.findOneAndUpdate({ name }, flattened, {
    returnDocument: "after",
  })) as IChapter;

  return chapter;
};

type ChapParam = {
  name: object;
};

export const getChaptersFiltered = async ({
  params,
  page,
  sortParams,
}: SearchRequestBody<ChapterSearchParams>): Promise<
  SearchResponseBody<IChapterTableEntry> | undefined
> => {
  const newPage = page ?? 0;
  const numOfItems = 11;

  const chapterParamObject = {} as ChapParam;

  if (params.name) {
    chapterParamObject.name = { $regex: new RegExp(params.name, "i") };
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
      $unwind: "$metadata",
    },
    {
      $addFields: {
        numRecords: "$metadata.totalDocuments",
        newpage: "$metadata.page",
        numPages: "$metadata.totalPages",
      },
    },
  ]);

  return chapterFiltering[0] as
    | SearchResponseBody<IChapterTableEntry>
    | undefined;
};


export const aggregatePeople = async (chapterName : string) => {
  console.log(chapterName)

  const chapterStatistics = await User.aggregate([
    {
        $facet: {
            activeCount: [
                { $match : { 
                    chapter: chapterName, 
                    role: "Nonprofit Volunteer",
                    "adminDetails.active": true
                 } },
                 {
                    $count: "activeCount"
                 }
            ],
            inactiveCount: [
                { $match : { 
                    chapter: chapterName, 
                    role: "Nonprofit Volunteer",
                    "adminDetails.active": false
                 } },
                 {
                  
                  $count: "inactiveCount"
                 }
            ],
            patientCount : [
                {
                    $match : {
                        chapter: chapterName,
                        role: "Nonprofit Patient",
                    }
                },
                {
                    $count: "patientCount"
                }
            ]
        },
      },{
        $unwind: {
          path: "$activeCount",
          preserveNullAndEmptyArrays: true // To keep results if count is zero
        }
      },
      {
        $unwind: {
          path: "$inactiveCount",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$patientCount",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $project: {
          activeCount: { $ifNull: ["$activeCount.activeCount", 0] }, 
          inactiveCount: { $ifNull: ["$inactiveCount.inactiveCount", 0] },
          patientCount: { $ifNull: ["$patientCount.patientCount", 0] }
        }
      },
      {
        $unwind: "$activeCount"
      }
]);

console.log(chapterStatistics[0]);
};
