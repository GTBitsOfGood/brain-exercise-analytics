import APIWrapper from "@server/utils/APIWrapper";
import {
  AnalyticsSectionEnum,
  DateRangeEnum,
  Role,
} from "@/common_utils/types";
import { getAggregatedAnalytics } from "@server/mongodb/actions/AggregatedAnalytics";
import { getUserById } from "@server/mongodb/actions/User";

export const GET = APIWrapper({
  config: {
    // requireToken: true,
    // requireVolunteer: true,
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
      ? Object.values(AnalyticsSectionEnum).filter(
          (section) => section !== AnalyticsSectionEnum.OVERALL,
        )
      : Array.from(new Set(sections));

    const user = await getUserById(id);
    if (user?.role !== Role.NONPROFIT_PATIENT) {
      throw new Error("User is not a patient");
    }
    const data = await getAggregatedAnalytics(id, user.name, range, updatedSections);

    return data;
  },
});
