import APIWrapper from "@server/utils/APIWrapper";
import { getAnalyticsByUserId } from "@server/mongodb/actions/Analytics";
import { DateRangeEnum } from "@/common_utils/types";
import { getAggregatedAnalytics } from "@server/mongodb/actions/AggregatedAnalytics";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const range = searchParams.get("range");

    if (!id || !range) {
      throw new Error("ID or range missing in request");
    }

    const rangeEnum =
      Object.keys(DateRangeEnum)[
        Object.values(DateRangeEnum).indexOf(range as unknown as DateRangeEnum)
      ];
    const res = await getAnalyticsByUserId(id);

    if (!res || !rangeEnum) {
      throw new Error("Invalid ID or range");
    }

    const data = await getAggregatedAnalytics(id, rangeEnum, "reading"); // rangeEnum);

    return data;
  },
});
