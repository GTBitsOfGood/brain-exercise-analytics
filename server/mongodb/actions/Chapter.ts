import {
  ChapterSearchParams,
  IChapter,
  RecursivePartial,
  SearchResponseBody,
  SearchRequestBody,
  IChapterTableEntry,
  IUser,
  Role,
} from "@/common_utils/types";
import { flatten } from "mongo-dot-notation";
import { ObjectId, PipelineStage, Promise } from "mongoose";
import Chapter from "../models/Chapter";
import User from "../models/User";

export const getChapters = async (): Promise<IChapter[] | null> => {
  const chapters = await Chapter.find<IChapter>();
  return chapters;
};

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
  entriesPerPage,
  sortParams,
}: SearchRequestBody<ChapterSearchParams>): Promise<
  SearchResponseBody<IChapterTableEntry> | undefined
> => {
  console.log(entriesPerPage);
  const newPage = page ?? 0;
  const numOfItems = entriesPerPage || 8;

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
  activeVolunteers: number;
  inactiveVolunteers: number;
  patients: number;
};

export const aggregatePeople = async (
  chapterName: string,
): Promise<ChapterStatistics | null> => {
  const chapterStatistics: ChapterStatistics[] = await User.aggregate([
    {
      $facet: {
        activeVolunteers: [
          {
            $match: {
              chapter: chapterName,
              role: "Nonprofit Volunteer",
              "adminDetails.active": true,
            },
          },
          {
            $count: "activeVolunteers",
          },
        ],
        inactiveVolunteers: [
          {
            $match: {
              chapter: chapterName,
              role: "Nonprofit Volunteer",
              "adminDetails.active": false,
            },
          },
          {
            $count: "inactiveVolunteers",
          },
        ],
        patients: [
          {
            $match: {
              chapter: chapterName,
              role: "Nonprofit Patient",
            },
          },
          {
            $count: "patients",
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$activeVolunteers",
        preserveNullAndEmptyArrays: true, // To keep results if count is zero
      },
    },
    {
      $unwind: {
        path: "$inactiveVolunteers",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$patients",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        activeVolunteers: {
          $ifNull: ["$activeVolunteers.activeVolunteers", 0],
        },
        inactiveVolunteers: {
          $ifNull: ["$inactiveVolunteers.inactiveVolunteers", 0],
        },
        patients: { $ifNull: ["$patients.patients", 0] },
      },
    },
  ]);

  await Chapter.findOneAndUpdate(
    { name: chapterName },
    {
      $set: {
        activeVolunteers: chapterStatistics[0].activeVolunteers,
        inactiveVolunteers: chapterStatistics[0].inactiveVolunteers,
        patients: chapterStatistics[0].patients,
      },
    },
    { new: true },
  );

  return chapterStatistics[0];
};

export type PostReq = {
  name: string;
  chapterPresident: ObjectId;
  yearFounded: number;
  country: string;
  city?: string;
  state?: string;
  president: IUser;
};

export const createChapter = async ({
  name,
  chapterPresident,
  yearFounded,
  country,
  state = "",
  city = "",
  president,
}: PostReq): Promise<IChapter> => {
  await Chapter.create({
    name,
    chapterPresident,
    yearFounded,
    location: {
      country,
      state,
      city,
    },
  });

  await User.findOneAndUpdate<IUser>(
    { email: president.email },
    {
      chapter: name,
      role: Role.NONPROFIT_CHAPTER_PRESIDENT,
    },
  );

  const stats = (await aggregatePeople(name)) as ChapterStatistics;

  const updateFilter = {
    $set: {
      activeVolunteers: stats.activeVolunteers,
      inactiveVolunteers: stats.inactiveVolunteers,
      patients: stats.patients,
    },
  };

  const newStatsChapter: IChapter | null = await Chapter.findOneAndUpdate(
    { name },
    updateFilter,
    { new: true },
  );

  return newStatsChapter as IChapter;
};
