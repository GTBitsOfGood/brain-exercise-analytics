/* eslint-disable no-param-reassign */
import {
  StackedDataRecord,
  DataRecord,
  IAggregatedAnalyticsAll,
  IAnalytics,
  DateRangeEnum,
  AnalyticsSectionEnum,
  IUser,
} from "@/common_utils/types";
import { formatDateByRangeEnum, getCurrentMonday } from "@server/utils/utils";
import mongoose from "mongoose";
import User from "../models/User";
import Analytics from "../models/Analytics";

type TempAggData = Partial<{
  [K in AnalyticsSectionEnum]: {
    [property: string]: number;
  };
}>;

type Result = Partial<{
  overall: {
    streakHistory: DataRecord[];
  };
  math: {
    avgAccuracy: DataRecord[];
    avgDifficultyScore: DataRecord[];
    avgQuestionsCompleted: DataRecord[];
    avgTimePerQuestion: DataRecord[];
  };
  reading: {
    sessionCompletion: StackedDataRecord[];
    avgWordsPerMin: DataRecord[];
    avgPassagesRead: DataRecord[];
    avgTimePerPassage: DataRecord[];
  };
  writing: {
    sessionCompletion: StackedDataRecord[];
    avgPromptsAnswered: DataRecord[];
    avgTimePerQuestion: DataRecord[];
  };
  trivia: {
    avgAccuracy: DataRecord[];
    avgQuestionsCompleted: DataRecord[];
    avgTimePerQuestion: DataRecord[];
  };
}>;

type AggregatedAnalyticsResponse = {
  analytics: Partial<IAggregatedAnalyticsAll>[]; // The array list
  activePatients: number; // The first additional attribute
  totalPatients: number; // The second additional attribute
};

export const getAggregatedAnalytics = async (
  userIDs: string[],
  range: DateRangeEnum,
  sections: AnalyticsSectionEnum[],
): Promise<AggregatedAnalyticsResponse> => {
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
  const objectIdArray = userIDs.map((id) => new mongoose.Types.ObjectId(id));
  const userRecords = await User.find<IUser>(
    { _id: { $in: objectIdArray } },
    { weeklyMetrics: { $slice: [1, numOfWeeks] } },
  );

  const analyticsRecords = await Analytics.find<IAnalytics>(
    { userID: { $in: userIDs } },
    { weeklyMetrics: { $slice: [1, numOfWeeks] } },
  )
    .limit(1000)
    .lean();

  let activeUsers: { count: number }[] = [];

  if (userIDs.length > 1) {
    activeUsers = await User.aggregate([
      {
        $match: {
          _id: { $in: objectIdArray },
        },
      },
      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "userID",
          as: "analyticsRecords",
        },
      },
      {
        $unwind: {
          path: "$analyticsRecords",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "analyticsRecords.active": true,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
  }

  if (!analyticsRecords) {
    throw new Error("User Analytics record not found");
  }

  console.log("p");
  const out: Partial<IAggregatedAnalyticsAll>[] = [];

  const lastMonday = new Date(getCurrentMonday().getDate() - 7);
  for (let i = 0; i < analyticsRecords.length; i += 1) {
    const analyticsRecord = analyticsRecords[i] as IAnalytics;
    const user = userRecords[i];

    const groupSumDict: Record<string, TempAggData> = {};

    const lenOfMetrics = analyticsRecord.weeklyMetrics.length;

    // reversing the list
    const reversedWeeklyMetrics = analyticsRecord.weeklyMetrics.reverse();

    const paddingDate =
      reversedWeeklyMetrics.length === 0
        ? lastMonday
        : new Date(reversedWeeklyMetrics[0].date);

    const dbDateVars = new Set<string>();

    reversedWeeklyMetrics.forEach((item: IAnalytics["weeklyMetrics"][0]) => {
      let dateVar = formatDateByRangeEnum(item.date, range);

      // adds to previous date in groups of 2
      if (range === DateRangeEnum.HALF) {
        dateVar = formatDateByRangeEnum(item.date, range, true);
      }

      if (range === DateRangeEnum.MAX) {
        if (lenOfMetrics > 12) {
          dateVar = formatDateByRangeEnum(item.date, range, true);
        } else {
          dateVar = formatDateByRangeEnum(item.date, range);
        }
      }

      if (!dbDateVars.has(dateVar)) {
        dbDateVars.add(dateVar);
      }

      if (!groupSumDict[dateVar]) {
        groupSumDict[dateVar] = {};
      }
      sections.forEach((type) => {
        switch (type) {
          case AnalyticsSectionEnum.OVERALL: {
            const overallObj = groupSumDict[dateVar].overall ?? {
              totalNum: 0,
              streakLength: 0,
              totalSessionsCompleted: 0,
            };
            overallObj.totalNum += 1;
            overallObj.streakLength += item.streakLength;
            overallObj.totalSessionsCompleted +=
              item.math.sessionsCompleted +
              item.reading.sessionsCompleted +
              item.trivia.sessionsCompleted +
              item.writing.sessionsCompleted;
            groupSumDict[dateVar].overall = overallObj;
            break;
          }
          case AnalyticsSectionEnum.MATH: {
            const mathObj = groupSumDict[dateVar].math ?? {
              totalNum: 0,
              questionsCorrect: 0,
              questionsCompleted: 0,
              avgDifficultyScore: 0,
              avgTimePerQuestion: 0,
            };
            mathObj.totalNum += 1;
            mathObj.questionsCorrect += item.math.questionsCorrect;
            mathObj.avgDifficultyScore += item.math.finalDifficultyScore;
            mathObj.questionsCompleted += item.math.questionsAttempted;
            mathObj.avgTimePerQuestion += item.math.timePerQuestion;
            groupSumDict[dateVar].math = mathObj;
            break;
          }
          case AnalyticsSectionEnum.READING: {
            const readingObj = groupSumDict[dateVar].reading ?? {
              totalNum: 0,
              avgSessionsCompleted: 0,
              avgSessionsAttempted: 0,
              avgWordsPerMin: 0,
              avgPassagesRead: 0,
              avgTimePerPassage: 0,
            };
            readingObj.totalNum += 1;
            readingObj.avgSessionsCompleted += item.reading.sessionsCompleted;
            readingObj.avgSessionsAttempted += item.reading.sessionsAttempted;
            readingObj.avgWordsPerMin += item.reading.wordsPerMinute;
            readingObj.avgPassagesRead += item.reading.passagesRead;
            readingObj.avgTimePerPassage += item.reading.timePerPassage;
            groupSumDict[dateVar].reading = readingObj;
            break;
          }
          case AnalyticsSectionEnum.WRITING: {
            const writingObj = groupSumDict[dateVar].writing ?? {
              totalNum: 0,
              avgSessionsCompleted: 0,
              avgSessionsAttempted: 0,
              avgPromptsAnswered: 0,
              avgTimePerQuestion: 0,
            };
            writingObj.totalNum += 1;
            writingObj.avgSessionsCompleted += item.writing.sessionsCompleted;
            writingObj.avgSessionsAttempted += item.writing.sessionsAttempted;
            writingObj.avgPromptsAnswered += item.writing.questionsAnswered;
            writingObj.avgTimePerQuestion += item.writing.timePerQuestion;
            groupSumDict[dateVar].writing = writingObj;
            break;
          }
          case AnalyticsSectionEnum.TRIVIA: {
            const triviaObj = groupSumDict[dateVar].trivia ?? {
              totalNum: 0,
              questionsCorrect: 0,
              questionsCompleted: 0,
              avgTimePerQuestion: 0,
            };
            triviaObj.totalNum += 1;
            triviaObj.questionsCorrect += item.trivia.questionsCorrect;
            triviaObj.questionsCompleted += item.trivia.questionsAttempted;
            triviaObj.avgTimePerQuestion += item.trivia.timePerQuestion;
            groupSumDict[dateVar].trivia = triviaObj;
            break;
          }
          default:
            break;
        }
      });
    });
    console.log("o");
    const excludedProperties = new Set([
      "totalNum",
      "questionsCompleted",
      "questionsCorrect",
    ]);

    Object.values(groupSumDict).forEach((monthDict) => {
      Object.values(monthDict).forEach((monthTypeDict) => {
        Object.keys(monthTypeDict).forEach((property) => {
          if (!excludedProperties.has(property)) {
            monthTypeDict[property] =
              monthTypeDict.totalNum === 0
                ? 0
                : monthTypeDict[property] / monthTypeDict.totalNum;
          } else if (property === "questionsCompleted") {
            monthTypeDict.avgQuestionsCompleted =
              monthTypeDict.totalNum === 0
                ? 0
                : monthTypeDict.questionsCompleted / monthTypeDict.totalNum;

            monthTypeDict.avgAccuracy =
              monthTypeDict.questionsCompleted === 0
                ? 0
                : Math.round(
                    (100 * monthTypeDict.questionsCorrect) /
                      monthTypeDict.questionsCompleted,
                  ) / 100;
          }
        });
      });
    });

    console.log("j");
    const allDateVars = Array.from(dbDateVars).reverse();

    // PADDING
    let len = Object.keys(groupSumDict).length;

    let totalWeeks = numOfWeeks;
    if (range === DateRangeEnum.HALF) {
      totalWeeks = 6;
    } else if (range === DateRangeEnum.YEAR) {
      totalWeeks = 12;
    } else if (range === DateRangeEnum.MAX) {
      if (lenOfMetrics === 1) {
        totalWeeks = 6;
      } else {
        totalWeeks = 0;
      }
    }

    if (
      userIDs.length === 1 &&
      (analyticsRecords[0].weeklyMetrics as []).length === 0
    ) {
      totalWeeks = 0;
    }

    while (len < totalWeeks) {
      if (range === DateRangeEnum.RECENT || range === DateRangeEnum.QUARTER) {
        paddingDate.setDate(paddingDate.getDate() - 7);
      } else if (range === DateRangeEnum.HALF) {
        paddingDate.setMonth(paddingDate.getMonth() - 1);
      } else if (range === DateRangeEnum.YEAR) {
        paddingDate.setMonth(paddingDate.getMonth() - 1);
      } else if (range === DateRangeEnum.MAX) {
        paddingDate.setDate(paddingDate.getDate() - 7);
      }
      const tempDateString = formatDateByRangeEnum(paddingDate, range);

      allDateVars.push(tempDateString);
      groupSumDict[tempDateString] = Object.fromEntries(
        Object.entries({
          overall: {
            streakLength: 0,
            streakHistory: 0,
          },
          math: {
            avgAccuracy: 0,
            avgDifficultyScore: 0,
            avgQuestionsCompleted: 0,
            avgTimePerQuestion: 0,
          },
          reading: {
            avgSessionsCompleted: 0,
            avgSessionsAttempted: 0,
            avgWordsPerMin: 0,
            avgPassagesRead: 0,
            avgTimePerPassage: 0,
          },
          writing: {
            avgSessionsCompleted: 0,
            avgSessionsAttempted: 0,
            avgPromptsAnswered: 0,
            avgTimePerQuestion: 0,
          },
          trivia: {
            avgAccuracy: 0,
            avgQuestionsCompleted: 0,
            avgTimePerQuestion: 0,
          },
        }).filter(([k]) => sections.includes(k as AnalyticsSectionEnum)),
      );

      len += 1;
    }

    const result: Result = {};
    sections.forEach((type) => {
      switch (type) {
        case AnalyticsSectionEnum.OVERALL: {
          result.overall = {
            streakHistory: [],
          };
          break;
        }
        case AnalyticsSectionEnum.MATH: {
          result.math = {
            avgAccuracy: [],
            avgDifficultyScore: [],
            avgQuestionsCompleted: [],
            avgTimePerQuestion: [],
          };
          break;
        }
        case AnalyticsSectionEnum.READING: {
          result.reading = {
            sessionCompletion: [],
            avgWordsPerMin: [],
            avgPassagesRead: [],
            avgTimePerPassage: [],
          };
          break;
        }
        case AnalyticsSectionEnum.WRITING: {
          result.writing = {
            sessionCompletion: [],
            avgPromptsAnswered: [],
            avgTimePerQuestion: [],
          };
          break;
        }
        case AnalyticsSectionEnum.TRIVIA: {
          result.trivia = {
            avgAccuracy: [],
            avgQuestionsCompleted: [],
            avgTimePerQuestion: [],
          };
          break;
        }
        default:
          break;
      }
    });

    console.log("sd");
    const excludedProperties2 = new Set([
      "totalNum",
      "questionsCompleted",
      "questionsCorrect",
      "avgSessionsAttempted",
    ]);
    console.log("s2");
    allDateVars.forEach((month) => {
      Object.entries(groupSumDict[month]).forEach(([type, monthTypeDict]) => {
        Object.keys(monthTypeDict).forEach((property) => {
          if (property === "avgSessionsCompleted") {
            const dr: StackedDataRecord = {
              interval: month,
              value: monthTypeDict.avgSessionsCompleted,
              stackedValue: monthTypeDict.avgSessionsAttempted,
            };

            if (type === "reading" || type === "writing") {
              const obj = result[type];
              if (!obj) return;

              if (!obj.sessionCompletion) {
                obj.sessionCompletion = [dr];
              } else {
                obj.sessionCompletion.unshift(dr);
                // obj.sessionCompletion.push(dr);
              }
            }
            return;
          }

          if (excludedProperties2.has(property)) {
            return;
          }

          let dr: DataRecord;

          if (property === "totalSessionsCompleted") {
            dr = {
              interval: month,
              value: monthTypeDict.totalSessionsCompleted,
            };
            const obj = result.overall;
            if (obj) {
              obj.streakHistory.unshift(dr);
            }
          }

          dr = {
            interval: month,
            value: monthTypeDict[property],
          };

          const obj = result[type as AnalyticsSectionEnum];
          if (!obj) return;

          if (!obj[property as keyof typeof obj]) {
            (obj[property as keyof typeof obj] as DataRecord[]) = [dr];
          } else {
            (obj[property as keyof typeof obj] as DataRecord[]).unshift(dr);
          }
        });
      });
    });

    console.log(analyticsRecord.lastSessionMetrics);
    // if overshoot, remove last element
    // const groupSumArray = Object.values(groupSumDict)
    // if ((groupSumArray.length === 4 && range === "quarter") ||
    //       (groupSumArray.length === 7 && range === "half") ||
    //       (groupSumArray.length === 13 && range === "year")) {
    //   groupSumArray.pop()
    // }s
    const finalAggregation: Partial<IAggregatedAnalyticsAll> = {};
    sections.forEach((type) => {
      switch (type) {
        case AnalyticsSectionEnum.OVERALL: {
          if (!result.overall) return;
          finalAggregation.overall = {
            ...result.overall,
            active: analyticsRecord.active,
            streak: analyticsRecord.streak,
            startDate: user?.startDate ? new Date(user.startDate) : new Date(),
            lastSessionDate: analyticsRecord.lastSessionMetrics.date,
            totalSessionsCompleted: analyticsRecord.totalSessionsCompleted,
            lastSession: {
              mathQuestionsCompleted:
                analyticsRecord.lastSessionMetrics.math.questionsAttempted,
              wordsRead:
                analyticsRecord.lastSessionMetrics.reading.passagesRead,
              promptsCompleted:
                analyticsRecord.lastSessionMetrics.writing.questionsAnswered, // writing
              triviaQuestionsCompleted:
                analyticsRecord.lastSessionMetrics.trivia.questionsAttempted,
            },
            name: `${user.firstName} ${user.lastName}`,
          };
          break;
        }
        case AnalyticsSectionEnum.MATH: {
          if (!result.math) return;
          finalAggregation.math = {
            ...result.math,
            lastSession: {
              accuracy:
                analyticsRecord.lastSessionMetrics.math.questionsAttempted === 0
                  ? 0
                  : analyticsRecord.lastSessionMetrics.math.questionsCorrect /
                    analyticsRecord.lastSessionMetrics.math.questionsAttempted,
              difficultyScore:
                analyticsRecord.lastSessionMetrics.math.finalDifficultyScore,
              questionsCompleted:
                analyticsRecord.lastSessionMetrics.math.questionsAttempted,
              timePerQuestion:
                analyticsRecord.lastSessionMetrics.math.timePerQuestion,
            },
          };
          break;
        }
        case AnalyticsSectionEnum.READING: {
          if (!result.reading) return;
          finalAggregation.reading = {
            ...result.reading,
            lastSession: {
              passagesRead:
                analyticsRecord.lastSessionMetrics.reading.passagesRead,
              timePerPassage:
                analyticsRecord.lastSessionMetrics.reading.timePerPassage,
              completed:
                analyticsRecord.lastSessionMetrics.reading.questionsAnswered !==
                0,
            },
          };
          break;
        }
        case AnalyticsSectionEnum.WRITING: {
          if (!result.writing) return;
          finalAggregation.writing = {
            ...result.writing,
            lastSession: {
              promptsAnswered:
                analyticsRecord.lastSessionMetrics.writing.questionsAnswered,
              timePerPrompt:
                analyticsRecord.lastSessionMetrics.writing.timePerQuestion,
              completed:
                analyticsRecord.lastSessionMetrics.writing.questionsAnswered !==
                0,
            },
          };
          break;
        }
        case AnalyticsSectionEnum.TRIVIA: {
          if (!result.trivia) return;
          finalAggregation.trivia = {
            ...result.trivia,
            lastSession: {
              accuracy:
                analyticsRecord.lastSessionMetrics.trivia.questionsAttempted ===
                0
                  ? 0
                  : analyticsRecord.lastSessionMetrics.trivia.questionsCorrect /
                    analyticsRecord.lastSessionMetrics.trivia
                      .questionsAttempted,
              questionsCompleted:
                analyticsRecord.lastSessionMetrics.trivia.questionsAttempted,
              timePerQuestion:
                analyticsRecord.lastSessionMetrics.trivia.timePerQuestion,
            },
          };
          break;
        }
        default:
          break;
      }
    });

    out.push(finalAggregation);
  }
  const finalOut: AggregatedAnalyticsResponse = {
    analytics: out,
    totalPatients: userIDs.length,
    activePatients: activeUsers[0]?.count || 0,
  };

  // console.log(finalOut)

  return finalOut;
};
