import {
  DataRecord,
  IAggregatedOverallAnalytics,
  IOverallAnalytics,
} from "@/common_utils/types";
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

export const getAggregatedOverallAnalytics =
  async (): Promise<IAggregatedOverallAnalytics> => {
    type TempAggData = {
      activeHistory: number;
    };
    type WeeklyMetrics = {
      date: Date;
      activeUsers: number;
      totalUsers: number;
    };
    type Result = {
      activeHistory: DataRecord[];
    };

    const numOfWeeks = 7;

    const res = await OverallAnalytics.findOne<IOverallAnalytics>(
      {},
      { weeklyMetrics: { $slice: [1, numOfWeeks] } },
    );
    const groupSumDict: Record<string, TempAggData> = {};

    let lastDate = new Date();
    res!.weeklyMetrics.forEach((item: WeeklyMetrics) => {
      const dateVar = `${item.date.getMonth() + 1}/${item.date.getUTCDate()}`;
      lastDate = item.date;

      groupSumDict[dateVar] = {
        activeHistory: item.activeUsers,
      };
    });

    let len = Object.keys(groupSumDict).length;
    while (len < numOfWeeks) {
      lastDate.setDate(lastDate.getDate() - 7);
      const tempDateString = `${
        lastDate.getMonth() + 1
      }/${lastDate.getUTCDate()}`;
      groupSumDict[tempDateString] = {
        activeHistory: 0,
      };
      len += 1;
    }

    const singleAnalytics = {
      totalUsers: res!.totalUsers,
      activeUsers: res!.activeUsers,
    };

    const result: Result = {
      activeHistory: [],
    };

    const record = Object.keys(groupSumDict).map((month) => ({
      interval: month,
      value: groupSumDict[month].activeHistory,
    }));
    result.activeHistory = record.reverse();

    const aggOut = {
      ...singleAnalytics,
      ...result,
    } as IAggregatedOverallAnalytics;
    return aggOut;
  };
