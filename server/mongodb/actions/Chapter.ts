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
export type ChapterStatistics = {
  activeVolunteers: number,
  inactiveVolunteers: number,
  patients: number,
}

export const aggregatePeople = async (chapterName : string) : Promise<ChapterStatistics | null> => {
  console.log(chapterName)

  const chapterStatistics = await User.aggregate([
    {
        $facet: {
            activeVolunteers: [
                { $match : { 
                    chapter: chapterName, 
                    role: "Nonprofit Volunteer",
                    "adminDetails.active": true
                 } },
                 {
                    $count: "activeVolunteers"
                 }
            ],
            inactiveVolunteers: [
                { $match : { 
                    chapter: chapterName, 
                    role: "Nonprofit Volunteer",
                    "adminDetails.active": false
                 } },
                 {
                  
                  $count: "inactiveVolunteers"
                 }
            ],
            patients : [
                {
                    $match : {
                        chapter: chapterName,
                        role: "Nonprofit Patient",
                    }
                },
                {
                    $count: "patients"
                }
            ]
        },
      },{
        $unwind: {
          path: "$activeVolunteers",
          preserveNullAndEmptyArrays: true // To keep results if count is zero
        }
      },
      {
        $unwind: {
          path: "$inactiveVolunteers",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$patients",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $project: {
          activeVolunteers: { $ifNull: ["$activeVolunteers.activeVolunteers", 0] }, 
          inactiveVolunteers: { $ifNull: ["$inactiveVolunteers.inactiveVolunteers", 0] },
          patients: { $ifNull: ["$patients.patients", 0] }
        }
      },
]);

return chapterStatistics[0]
};
