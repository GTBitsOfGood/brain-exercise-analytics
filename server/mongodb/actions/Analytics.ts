import Analytics from "@server/mongodb/models/Analytics";
import { Days, IAnalytics } from "@/common_utils/types";
import { getCurrentMonday } from "@server/utils/utils";

export const getAnalyticsByID = async (
  userID: string,
): Promise<IAnalytics | null> => {
  const analytics = await Analytics.findOne<IAnalytics>({ userID });
  return analytics;
};

export const createAnalyticsID = async (
  userID: string,
): Promise<IAnalytics> => {
  const analytics = (await Analytics.create({ userID })) as IAnalytics;
  return analytics;
};

// modify math function that sets and updates the object with the userID.
export const modifyMath = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
  difficultyScore: number,
): Promise<IAnalytics | null> => {
  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionMetrics.math.questionsAttempted": questionsAttempted,
        "lastSessionMetrics.math.questionsCorrect": questionsCorrect,
        "lastSessionMetrics.math.timePerQuestion": timePerQuestion,
        "lastSessionMetrics.math.finalDifficultyScore": difficultyScore,
      },
      $inc: {
        "weeklyMetrics.0.math.sessionsCompleted": 1,
        "weeklyMetrics.0.math.questionsAttempted": questionsAttempted,
        "weeklyMetrics.0.math.questionsCorrect": questionsCorrect,
        "weeklyMetrics.0.math.timePerQuestion": timePerQuestion, // this can be changed to total time to better account for different number of questions attempted
        "weeklyMetrics.0.math.finalDifficultyScore": difficultyScore,
      },
    },
    { new: true },
  );

  return data;
};

// modifyTrivia function
export const modifyTrivia = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
): Promise<IAnalytics | null> => {
  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionMetrics.trivia.questionsAttempted": questionsAttempted,
        "lastSessionMetrics.trivia.questionsCorrect": questionsCorrect,
        "lastSessionMetrics.trivia.timePerQuestion": timePerQuestion,
      },
      $inc: {
        "weeklyMetrics.0.trivia.sessionsCompleted": 1,
        "weeklyMetrics.0.trivia.questionsAttempted": questionsAttempted,
        "weeklyMetrics.0.trivia.questionsCorrect": questionsCorrect,
        "weeklyMetrics.0.trivia.timePerQuestion": timePerQuestion, // this can be changed to total time to better account for different number of questions attempted
      },
    },
    { new: true },
  );

  return data;
};

// modifyReading function
export const modifyReading = async (
  userID: string,
  completed: boolean,
  passagesRead: number,
): Promise<IAnalytics | null> => {
  const increment = completed ? 1 : 0;

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionMetrics.reading.passagesRead": passagesRead,
      },
      $inc: {
        "weeklyMetrics.0.reading.sessionsCompleted": increment,
        "weeklyMetrics.0.reading.sessionsAttempted": 1,
        "weeklyMetrics.0.reading.passagesRead": passagesRead,
      },
    },
    { new: true },
  );

  return data;
};

// modifySessionComplete function
export const updateSessionComplete = async (
  userID: string,
): Promise<IAnalytics | null> => {
  const today = new Date();
  const dayOfWeek = Days[today.getDay()];

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $addToSet: {
        streak: dayOfWeek,
      },
      $inc: {
        totalSessionsCompleted: 1,
        "weeklyMetrics.0.sessionsCompleted": 1,
      },
    },
    { new: true },
  );

  return data;
};

// average weekly stats function
export const averageWeeklyStats = async () => {
  // divide all values by completed sessions and added streaklength
  await Analytics.updateMany({}, [
    {
      $set: {
        weeklyMetrics: {
          $map: {
            input: {
              $range: [0, { $size: "$weeklyMetrics" }],
            },
            in: {
              $cond: [
                { $eq: ["$$this", 0] },
                {
                  $mergeObjects: [
                    { $arrayElemAt: ["$weeklyMetrics", "$$this"] },
                    {
                      streakLength: { $size: "$streak" },
                      math: {
                        $let: {
                          vars: {
                            firstItem: {
                              $arrayElemAt: ["$weeklyMetrics", 0],
                            },
                          },
                          in: {
                            sessionsCompleted:
                              "$$firstItem.math.sessionsCompleted",
                            questionsAttempted: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.math.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.math.questionsAttempted",
                                    "$$firstItem.math.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                            questionsCorrect: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.math.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.math.questionsCorrect",
                                    "$$firstItem.math.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                            finalDifficultyScore: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.math.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.math.finalDifficultyScore",
                                    "$$firstItem.math.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                            timePerQuestion: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.math.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.math.timePerQuestion",
                                    "$$firstItem.math.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                      trivia: {
                        $let: {
                          vars: {
                            firstItem: {
                              $arrayElemAt: ["$weeklyMetrics", 0],
                            },
                          },
                          in: {
                            sessionsCompleted:
                              "$$firstItem.trivia.sessionsCompleted",
                            questionsAttempted: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.trivia.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.trivia.questionsAttempted",
                                    "$$firstItem.trivia.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                            questionsCorrect: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.trivia.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.trivia.questionsCorrect",
                                    "$$firstItem.trivia.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                            timePerQuestion: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.trivia.sessionsCompleted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.trivia.timePerQuestion",
                                    "$$firstItem.trivia.sessionsCompleted",
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                      reading: {
                        $let: {
                          vars: {
                            firstItem: {
                              $arrayElemAt: ["$weeklyMetrics", 0],
                            },
                          },
                          in: {
                            sessionsAttempted:
                              "$$firstItem.reading.sessionsAttempted",
                            sessionsCompleted:
                              "$$firstItem.reading.sessionsCompleted",
                            passagesRead: {
                              $cond: [
                                {
                                  $eq: [
                                    "$$firstItem.reading.sessionsAttempted",
                                    0,
                                  ],
                                },
                                0,
                                {
                                  $divide: [
                                    "$$firstItem.reading.passagesRead",
                                    "$$firstItem.reading.sessionsAttempted",
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  $arrayElemAt: ["$weeklyMetrics", "$$this"],
                },
              ],
            },
          },
        },
      },
    },
  ]);

  // set streak to empty array and push new empty array
  await Analytics.updateMany(
    {},
    {
      $push: {
        weeklyMetrics: {
          $each: [
            {
              date: getCurrentMonday(),
              sessionsCompleted: 0,
              streakLength: 0,
              math: {
                sessionsCompleted: 0,
                questionsAttempted: 0,
                questionsCorrect: 0,
                finalDifficultyScore: 0,
                timePerQuestion: 0,
              },
              trivia: {
                sessionsCompleted: 0,
                questionsAttempted: 0,
                questionsCorrect: 0,
                timePerQuestion: 0,
              },
              reading: {
                sessionsAttempted: 0,
                sessionsCompleted: 0,
                passagesRead: 0,
              },
            },
          ],
          $position: 0,
        },
      },
      $set: {
        streak: [],
      },
    },
  );

  return null;
};
