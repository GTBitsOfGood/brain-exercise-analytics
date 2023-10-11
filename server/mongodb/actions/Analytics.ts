import Analytics from "@server/mongodb/models/Analytics";
import { Days, IAnalytics } from "@/common_utils/types";
import { getCurrentMonday } from "@server/utils/utils";
import { incrementActiveUsers, incrementTotalUsers } from "./OverallAnalytics";
import OverallAnalytics from "../models/OverallAnalytics";

export const getAnalyticsByID = async (
  userID: string,
): Promise<IAnalytics | null> => {
  const analytics = await Analytics.findOne<IAnalytics>({ userID });
  return analytics;
};

export const createAnalyticsID = async (
  userID: string,
): Promise<IAnalytics> => {
  const today = new Date();
  const analytics = (await Analytics.create({
    userID,
    startDate: today,
  })) as IAnalytics;
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
  timePerPassage: number,
  wordsPerMinute: number,
): Promise<IAnalytics | null> => {
  const increment = completed ? 1 : 0;

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionMetrics.reading.passagesRead": passagesRead,
        "lastSessionMetrics.reading.timePerPassage": timePerPassage,
        "lastSessionMetrics.reading.wordsPerMinute": wordsPerMinute,
      },
      $inc: {
        "weeklyMetrics.0.reading.sessionsCompleted": increment,
        "weeklyMetrics.0.reading.sessionsAttempted": 1,
        "weeklyMetrics.0.reading.passagesRead": passagesRead,
        "weeklyMetrics.0.reading.timePerPassage": timePerPassage,
        "weeklyMetrics.0.reading.wordsPerMinute": wordsPerMinute,
      },
    },
    { new: true },
  );

  return data;
};

export const modifyWriting = async (
  userID: string,
  completed: boolean,
  questionsAnswered: number,
  timePerQuestion: number,
): Promise<IAnalytics | null> => {
  const increment = completed ? 1 : 0;

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionMetrics.writing.questionsAnswered": questionsAnswered,
        "lastSessionMetrics.writing.timePerQuestion": timePerQuestion,
      },
      $inc: {
        "weeklyMetrics.0.writing.sessionsCompleted": increment,
        "weeklyMetrics.0.writing.sessionsAttempted": 1,
        "weeklyMetrics.0.writing.questionsAnswered": questionsAnswered,
        "weeklyMetrics.0.writing.timePerQuestion": timePerQuestion,
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
      $set: {
        "lastSessionMetrics.date": today,
      },
    },
    { new: true },
  );

  return data;
};

// average weekly stats function
export const averageWeeklyStats = async (): Promise<null> => {
  // divide all values by completed sessions and added streaklength

  function getDivideQuery(numeratorField: string, denominatorField: string) {
    return {
      $cond: [
        {
          $eq: [denominatorField, 0],
        },
        0,
        {
          $round: [
            {
              $divide: [numeratorField, denominatorField],
            },
            2,
          ],
        },
      ],
    };
  }

  function getActiveQuery(size: number, firstValue: number) {
    return {
      $switch: {
        branches: [
          {
            case: {
              $eq: [
                {
                  $size: "$weeklyMetrics",
                },
                size,
              ],
            },
            then: {
              $cond: [
                {
                  $gte: [
                    {
                      $arrayElemAt: [
                        "$weeklyMetrics.sessionsCompleted",
                        firstValue,
                      ],
                    },
                    2,
                  ],
                },
                true,
                false,
              ],
            },
          },
          {
            case: {
              $gt: [
                {
                  $size: "$weeklyMetrics",
                },
                size,
              ],
            },
            then: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        {
                          $arrayElemAt: [
                            "$weeklyMetrics.sessionsCompleted",
                            firstValue,
                          ],
                        },
                        2,
                      ],
                    },
                    {
                      $gte: [
                        {
                          $arrayElemAt: [
                            "$weeklyMetrics.sessionsCompleted",
                            firstValue + 1,
                          ],
                        },
                        2,
                      ],
                    },
                  ],
                },
                true,
                false,
              ],
            },
          },
        ],
        default: true,
      },
    };
  }

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
                            questionsAttempted: getDivideQuery(
                              "$$firstItem.math.questionsAttempted",
                              "$$firstItem.math.sessionsCompleted",
                            ),
                            questionsCorrect: getDivideQuery(
                              "$$firstItem.math.questionsCorrect",
                              "$$firstItem.math.sessionsCompleted",
                            ),
                            finalDifficultyScore: {
                              $cond: [
                                {
                                  $and: [
                                    {
                                      $eq: [
                                        "$$firstItem.math.sessionsCompleted",
                                        0,
                                      ],
                                    },
                                    {
                                      $gte: [
                                        {
                                          $size: "$weeklyMetrics",
                                        },
                                        2,
                                      ],
                                    },
                                  ],
                                },
                                {
                                  $arrayElemAt: [
                                    "$weeklyMetrics.math.finalDifficultyScore",
                                    1,
                                  ],
                                },
                                getDivideQuery(
                                  "$$firstItem.math.finalDifficultyScore",
                                  "$$firstItem.math.sessionsCompleted",
                                ),
                              ],
                            },
                            timePerQuestion: getDivideQuery(
                              "$$firstItem.math.timePerQuestion",
                              "$$firstItem.math.sessionsCompleted",
                            ),
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
                            questionsAttempted: getDivideQuery(
                              "$$firstItem.trivia.questionsAttempted",
                              "$$firstItem.trivia.sessionsCompleted",
                            ),
                            questionsCorrect: getDivideQuery(
                              "$$firstItem.trivia.questionsCorrect",
                              "$$firstItem.trivia.sessionsCompleted",
                            ),
                            timePerQuestion: getDivideQuery(
                              "$$firstItem.trivia.timePerQuestion",
                              "$$firstItem.trivia.sessionsCompleted",
                            ),
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
                            passagesRead: getDivideQuery(
                              "$$firstItem.reading.passagesRead",
                              "$$firstItem.reading.sessionsAttempted",
                            ),
                            timePerPassage: getDivideQuery(
                              "$$firstItem.reading.timePerPassage",
                              "$$firstItem.reading.sessionsAttempted",
                            ),
                            wordsPerMinute: {
                              $cond: [
                                {
                                  $and: [
                                    {
                                      $eq: [
                                        "$$firstItem.reading.sessionsAttempted",
                                        0,
                                      ],
                                    },
                                    {
                                      $gte: [
                                        {
                                          $size: "$weeklyMetrics",
                                        },
                                        2,
                                      ],
                                    },
                                  ],
                                },
                                {
                                  $arrayElemAt: [
                                    "$weeklyMetrics.reading.wordsPerMinute",
                                    1,
                                  ],
                                },
                                getDivideQuery(
                                  "$$firstItem.reading.wordsPerMinute",
                                  "$$firstItem.reading.sessionsAttempted",
                                ),
                              ],
                            },
                          },
                        },
                      },
                      writing: {
                        $let: {
                          vars: {
                            firstItem: {
                              $arrayElemAt: ["$weeklyMetrics", 0],
                            },
                          },
                          in: {
                            sessionsAttempted:
                              "$$firstItem.writing.sessionsAttempted",
                            sessionsCompleted:
                              "$$firstItem.writing.sessionsCompleted",
                            questionsAnswered: getDivideQuery(
                              "$$firstItem.writing.questionsAnswered",
                              "$$firstItem.writing.sessionsAttempted",
                            ),
                            timePerQuestion: getDivideQuery(
                              "$$firstItem.writing.timePerQuestion",
                              "$$firstItem.writing.sessionsAttempted",
                            ),
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
    [
      {
        $set: {
          weeklyMetrics: {
            $concatArrays: [
              [
                {
                  date: getCurrentMonday(),
                  sessionsCompleted: 0,
                  streakLength: 0,
                  active: getActiveQuery(1, 0),
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
                    timePerPassage: 0,
                    wordsPerMinute: 0,
                  },
                  writing: {
                    sessionsAttempted: 0,
                    sessionsCompleted: 0,
                    questionsAnswered: 0,
                    timePerQuestion: 0,
                  },
                },
              ],
              "$weeklyMetrics",
            ],
          },
          streak: [],
        },
      },
      {
        $set: {
          active: getActiveQuery(2, 1),
        },
      },
    ],
    { multi: true },
  );

  const result = await Analytics.aggregate([
    {
      $match: {
        active: true,
      },
    },
    {
      $count: "totalActiveUsers",
    },
  ]);

  const totalActiveUsers = result.length > 0 ? result[0].totalActiveUsers : 0;

  //await incrementActiveUsers(totalActiveUsers);

  await OverallAnalytics.updateMany({}, [
    {
      $set: {
        activeUsers: totalActiveUsers,
        weeklyMetrics: {
          $concatArrays: [
            [
              {
                date: getCurrentMonday(),
                totalUsers: "$totalUsers",
                activeUsers: totalActiveUsers,
              },
            ],
            "$weeklyMetrics",
          ],
        },
      },
    },
  ]);

  return null;
};
