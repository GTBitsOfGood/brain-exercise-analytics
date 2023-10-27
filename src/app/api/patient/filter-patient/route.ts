import APIWrapper from "@server/utils/APIWrapper";
import { getUsersFiltered } from "@server/mongodb/actions/User";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  // config: {
  //   requireToken: true,
  // },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);

    const pageNumber = searchParams.get("page") as unknown as number;
    const paramsObject = Object.fromEntries(searchParams.entries());
    delete paramsObject.page;

    const users = await getUsersFiltered(paramsObject, pageNumber);
    return users;
  },
});
