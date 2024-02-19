import APIWrapper from "@server/utils/APIWrapper";
import { getAggregatedOverallAnalytics } from "@server/mongodb/actions/OverallAnalytics";
import { DateRangeEnum } from "@/common_utils/types";

export const GET = APIWrapper({
  config: {
    // requireToken: true,
    // requireVolunteer: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const rangeString = searchParams.get("range");

    if (!rangeString) {
      throw new Error("Range missing in request");
    }

    let range: DateRangeEnum;
    try {
      // In case it was JSON stringified
      range = JSON.parse(rangeString) as DateRangeEnum;
    } catch (e) {
      range = rangeString as DateRangeEnum;
    }

    if (!Object.values(DateRangeEnum).includes(range)) {
      throw new Error("Invalid range in request");
    }

    const data = await getAggregatedOverallAnalytics(range);

    return data;
  },
});
