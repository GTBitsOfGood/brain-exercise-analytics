import APIWrapper from "@server/utils/APIWrapper";
// import { DateRangeEnum } from "@/common_utils/types";
import { getAggregatedOverallAnalytics } from "@server/mongodb/actions/OverallAnalytics";

export const GET = APIWrapper({
  config: {
    requireToken: true,
  },
  handler: async () => {
    // const rangeEnum =
    //   Object.keys(DateRangeEnum)[Object.values(DateRangeEnum).indexOf(range)];

    const data = await getAggregatedOverallAnalytics();

    return data;
  },
});
