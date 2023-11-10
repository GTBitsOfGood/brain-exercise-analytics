import APIWrapper from "@server/utils/APIWrapper";
import { getUserById } from "@server/mongodb/actions/User";

export const dynamic = "force-dynamic";

export const POST = APIWrapper({
  config: {
    requireToken: false,
  },
  handler: async (req) => {
    const data = (await req.json()) as { secret: string; id: string };
    const { secret, id } = data;
    if (!secret || secret !== process.env.INTERNAL_SECRET) {
      throw new Error(
        "Secret is missing in the request. This is a protected route.",
      );
    }
    if (!id) {
      throw new Error("Id parameter is missing in the request.");
    }

    const user = await getUserById(id);
    return user;
  },
});
