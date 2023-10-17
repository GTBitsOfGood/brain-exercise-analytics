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
