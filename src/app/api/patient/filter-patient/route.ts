import APIWrapper from "@server/utils/APIWrapper";
import { getUsersFiltered } from "@server/mongodb/actions/User";
import { PatientSearchParams, SearchRequestBody } from "@/common_utils/types";

export const dynamic = "force-dynamic";

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqdata =
      (await req.json()) as SearchRequestBody<PatientSearchParams>;

    const params = Object.fromEntries(
      Object.entries(reqdata.params).filter(
        ([, val]) =>
          val !== undefined &&
          val !== null &&
          (typeof val !== "string" || val.length > 0) &&
          (val.constructor !== Array || val.length > 0),
      ),
    );

    const users = await getUsersFiltered({
      params,
      page: reqdata.page,
      sortParams: reqdata.sortParams,
    });
    return users;
  },
});
