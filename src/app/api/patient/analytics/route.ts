import APIWrapper from "@server/utils/APIWrapper";
import { AnalyticsSectionEnum, DateRangeEnum } from "@/common_utils/types";
import { getAggregatedAnalytics } from "@server/mongodb/actions/AggregatedAnalytics";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const rangeString = searchParams.get("range");
    const sectionsString = searchParams.get("sections");

    if (!id || !rangeString || !sectionsString) {
      throw new Error("ID or Range missing in request");
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

    const sections = JSON.parse(sectionsString) as AnalyticsSectionEnum[];

    const enumValues = new Set(Object.values(AnalyticsSectionEnum));
    if (!sections || sections.some((section) => !enumValues.has(section))) {
      throw new Error("Invalid section in request");
    }

    const updatedSections = sections.includes(AnalyticsSectionEnum.OVERALL)
      ? Object.values(AnalyticsSectionEnum)
      : Array.from(new Set(sections));
    const data = (await getAggregatedAnalytics([id], range, updatedSections))
      .analytics[0];

    return data;
  },
});
