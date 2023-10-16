import Analytics from "@server/mongodb/models/Analytics";
import OverallAnalytics from "@server/mongodb/models/OverallAnalytics";
import { getCurrentMonday } from "@server/utils/utils";

interface IActiveUsers {
  totalActiveUsers: number;
}

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

  /*
    set streak to empty array and push new empty array
    the activeQuery(1,0) checks if the user is active based on the requirements.
    Then, it sets weeklyMetrics.active to that result and concatenates the array.
    Then, there is another $set operation that sets active to active based on the
    2nd and 3rd elements in the array because the new weekly metrics is already pushed.
    */
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

  const result = await Analytics.aggregate<IActiveUsers>([
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

  // await incrementActiveUsers(totalActiveUsers);

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
