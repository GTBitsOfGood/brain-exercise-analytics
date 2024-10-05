import { ChapterSearchParams, SearchRequestBody } from "@/common_utils/types";
import { getChaptersFiltered } from "@server/mongodb/actions/Chapter";
import APIWrapper from "@server/utils/APIWrapper";

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const reqData =
      (await req.json()) as SearchRequestBody<ChapterSearchParams>;

    const params = Object.fromEntries(
      Object.entries(reqData.params).filter(
        ([, val]) =>
          val !== undefined &&
          val !== null &&
          (typeof val !== "string" || val.length > 0) &&
          (!Array.isArray(val) || val.length > 0),
      ),
    );

    const chapters = await getChaptersFiltered({
      params,
      page: reqData.page,
      sortParams: reqData.sortParams,
    });

    return chapters;
  },
});
