import APIWrapper from "@server/utils/APIWrapper";
import { VolunteerSearchParams, SearchRequestBody } from "@/common_utils/types";
import { getVolunteersFiltered } from "@server/mongodb/actions/Volunteer";

export const dynamic = "force-dynamic";

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req) => {
    const reqdata =
      (await req.json()) as SearchRequestBody<VolunteerSearchParams>;

    const params: VolunteerSearchParams = Object.fromEntries(
      Object.entries(reqdata.params).filter(
        ([, val]) =>
          val !== undefined &&
          val !== null &&
          (typeof val !== "string" || val.length > 0) &&
          val.constructor !== Array,
      ),
    );

    const users = await getVolunteersFiltered({
      params,
      page: reqdata.page,
      sortParams: reqdata.sortParams,
    });
    return users;
  },
});
