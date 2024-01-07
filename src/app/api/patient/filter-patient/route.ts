import APIWrapper from "@server/utils/APIWrapper";
import { getUsersFiltered } from "@server/mongodb/actions/User";

export const dynamic = "force-dynamic";

type RequestData = {
  paramsObject: {
    name?: string;
    dateOfBirth?: string[];
    email?: string[];
    additionalAffiliation?: string[];
    secondName?: string;
    secondaryPhone?: string[];
    beiChapter?: string[];
    active?: boolean;
    country?: string[];
    state?: string[];
    city?: string[];
    dateOfJoin?: string[];
  };
  page: number;
  sortParams?: {
    value?: string;
    ascending?: boolean;
  };
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const reqdata: RequestData = (await req.json()) as RequestData;

    const users = await getUsersFiltered(
      reqdata.paramsObject,
      reqdata.page,
      reqdata.sortParams,
    );
    return users;
  },
});
