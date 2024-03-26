import APIWrapper from "@server/utils/APIWrapper";
import {
  VolunteerSearchParams,
  SearchRequestBody,
  Role,
} from "@/common_utils/types";
import { getVolunteersFiltered } from "@server/mongodb/actions/Volunteer";
import { getLowerAdminRoles } from "@src/utils/utils";

export const dynamic = "force-dynamic";

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireAdmin: true,
  },
  handler: async (req, currentUser) => {
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

    const lowerRoles: Role[] = getLowerAdminRoles(currentUser!.role);

    const users = await getVolunteersFiltered({
      params,
      page: reqdata.page,
      sortParams: reqdata.sortParams,
      lowerRoles,
    });
    return users;
  },
});
