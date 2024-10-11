import { IChapter, IUser, RecursivePartial } from "@/common_utils/types";
import {
  createChapter,
  deleteChapter,
  getChapterByName,
  updateChapter,
} from "@server/mongodb/actions/Chapter";
import User from "@server/mongodb/models/User";
import APIWrapper from "@server/utils/APIWrapper";
import { ObjectId } from "mongoose";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    const decodedName = name ? decodeURIComponent(name) : null;

    if (!decodedName) {
      throw new Error("Chapter Name is missing");
    }
    const chapter = await getChapterByName(decodedName);
    return chapter;
  },
});

type PatchReq = {
  name: string;
  newFields: RecursivePartial<IChapter>;
};

export const PATCH = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const reqData: PatchReq = (await req.json()) as PatchReq;
    const {
      name,
      newFields,
    }: { name: string; newFields: RecursivePartial<IChapter> } = reqData;

    if (!name) {
      throw new Error("Name is missing");
    }

    const chapter = await getChapterByName(name);
    if (!chapter) {
      throw new Error("No chapter with that name found");
    }

    const updatedChapter = await updateChapter(name, newFields);
    return updatedChapter;
  },
});

type DeleteReq = {
  name: string;
};

export const DELETE = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const reqData = (await req.json()) as DeleteReq;
    const { name } = reqData;

    if (!name) {
      throw new Error("Chapter Name is missing");
    }

    await deleteChapter(name);
  },
});

export type PostReq = {
  name: string;
  chapterPresident: ObjectId;
  yearFounded: number;
  country: string;
  city?: string;
  state?: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const reqData = (await req.json()) as PostReq;

    if (
      !reqData.name ||
      !reqData.chapterPresident ||
      !reqData.yearFounded ||
      !reqData.country
    ) {
      throw Error("Required Fields are missing");
    }

    const president: IUser | null = await User.findById(
      reqData.chapterPresident,
    );

    if (!president) {
      throw Error("Chapter president doesn't exist");
    }
    const dupeChapter: IChapter | null = await getChapterByName(reqData.name);
    if (dupeChapter) {
      throw Error("Duplicate Chapter name not allowed");
    }

    const chapter = await createChapter({ ...reqData, president });
    return chapter;
  },
});
