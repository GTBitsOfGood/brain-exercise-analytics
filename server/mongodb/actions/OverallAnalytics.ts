import {
  DataRecord,
  DateRangeEnum,
  IAggregatedOverallAnalytics,
  IOverallAnalytics,
} from "@/common_utils/types";
import { formatDateByRangeEnum } from "@server/utils/utils";
import OverallAnalytics from "../models/OverallAnalytics";

export const createOverallAnalytics = async (): Promise<null> => {
  await OverallAnalytics.create({});
  return null;
};

export const incrementActiveUsers = async (users: number): Promise<null> => {
  await OverallAnalytics.updateMany(
    {},
    {
      $set: {
        activeUsers: users,
        "weeklyMetrics.0.activeUsers": users,
      },
    },
  );
  return null;
};

export const incrementTotalUsers = async (): Promise<null> => {
  await OverallAnalytics.updateMany(
    {},
    {
      $inc: {
        totalUsers: 1,
      },
    },
  );
  return null;
};

export const getAggregatedOverallAnalytics = async (
  range: DateRangeEnum,
): Promise<IAggregatedOverallAnalytics> => {
  interface TempAggData {
    count: number;
    activeHistory: number;
  }

  type Result = {
    activeHistory: DataRecord[];
  };

  let numOfWeeks = Number.MAX_SAFE_INTEGER;

  if (range === DateRangeEnum.RECENT) {
    numOfWeeks = 7;
  } else if (range === DateRangeEnum.QUARTER) {
    numOfWeeks = 13;
  } else if (range === DateRangeEnum.HALF) {
    numOfWeeks = 26; // 26
  } else if (range === DateRangeEnum.YEAR) {
    numOfWeeks = 52; // 52
  }

  const res = await OverallAnalytics.findOne<IOverallAnalytics>(
    {},
    { weeklyMetrics: { $slice: [1, numOfWeeks] } },
  );

  if (!res) {
    throw new Error("OverallAnalytics record not found");
  }

  const groupSumDict: Record<string, TempAggData> = {};

  let counter = 0;
  const lenOfMetrics = res.weeklyMetrics.length;
  const groupSize = Math.floor(lenOfMetrics / 12);

  // reversing the list
  const reversedWeeklyMetrics = res.weeklyMetrics.reverse();
  const paddingDate = new Date(res.weeklyMetrics[0].date);

  let lastDate = new Date(res.weeklyMetrics[0].date);
  let lastDateMax = new Date(res.weeklyMetrics[0].date);

  const dbDateVars = new Set<string>();

  reversedWeeklyMetrics.forEach(
    (item: IOverallAnalytics["weeklyMetrics"][0]) => {
      let dateVar = formatDateByRangeEnum(item.date, range);

      // adds to previous date in groups of 2
      if (range === DateRangeEnum.HALF && counter % 2 === 1) {
        dateVar = formatDateByRangeEnum(lastDate, range);
      }

      // group into groups of 12 and put everything into the last object once it goes over
      if (range === DateRangeEnum.MAX) {
        if (counter % groupSize === 0 && counter < groupSize * 12) {
          lastDateMax = item.date;
        }
        dateVar = formatDateByRangeEnum(lastDateMax, range);
      }
      counter += 1;
      lastDate = item.date;

      if (!dbDateVars.has(dateVar)) {
        dbDateVars.add(dateVar);
      }

      if (groupSumDict[dateVar]) {
        groupSumDict[dateVar].count += 1;
        groupSumDict[dateVar].activeHistory += item.activeUsers;
      } else {
        groupSumDict[dateVar] = {
          count: 1,
          activeHistory: item.activeUsers,
        };
      }
    },
  );

  const result: Result = {
    activeHistory: [],
  };

  Object.entries(groupSumDict).forEach(([month, monthDict]) => {
    const dr: DataRecord = {
      interval: month,
      value:
        monthDict.count === 0 ? 0 : monthDict.activeHistory / monthDict.count,
    };
    result.activeHistory.push(dr);
  });

  result.activeHistory.reverse();

  // PADDING
  if (range !== DateRangeEnum.MAX) {
    let len = Object.keys(groupSumDict).length;

    let totalWeeks = numOfWeeks;
    if (range === DateRangeEnum.HALF) {
      totalWeeks = 13;
    } else if (range === DateRangeEnum.YEAR) {
      totalWeeks = 12;
    }

    while (len < totalWeeks) {
      if (range === DateRangeEnum.RECENT || range === DateRangeEnum.QUARTER) {
        paddingDate.setDate(paddingDate.getDate() - 7);
      } else if (range === DateRangeEnum.HALF) {
        paddingDate.setDate(paddingDate.getDate() - 14);
      } else if (range === DateRangeEnum.YEAR) {
        paddingDate.setMonth(paddingDate.getMonth() - 1);
      }

      const tempDateString = formatDateByRangeEnum(paddingDate, range);
      const dr: DataRecord = {
        interval: tempDateString,
        value: 0,
      };
      result.activeHistory.push(dr);

      len += 1;
    }
  }

  const singleAnalytics = {
    totalUsers: res.totalUsers,
    activeUsers: res.activeUsers,
  };

  const aggOut: IAggregatedOverallAnalytics = {
    ...singleAnalytics,
    ...result,
  };

  return aggOut;
};
