import {
  IAggregatedAnalyticsAll,
  StackedDataRecord,
  DataRecord,
  IAggregatedAnalyticsMath,
  IAggregatedAnalyticsWriting,
  IAggregatedAnalyticsTrivia,
  IAggregatedAnalyticsReading,
  IAnalytics,
} from "@/common_utils/types";
import Analytics from "../models/Analytics";

type WeeklyMetrics = {
  math: {
    sessionsCompleted: number;
    questionsAttempted: number;
    questionsCorrect: number;
    finalDifficultyScore: number;
    timePerQuestion: number;
  };
  trivia: {
    sessionsCompleted: number;
    questionsAttempted: number;
    questionsCorrect: number;
    timePerQuestion: number;
  };
  reading: {
    sessionsAttempted: number;
    sessionsCompleted: number;
    passagesRead: number;
    timePerPassage: number;
    wordsPerMinute: number;
  };
  writing: {
    sessionsAttempted: number;
    sessionsCompleted: number;
    questionsAnswered: number;
    timePerQuestion: number;
  };
  date: Date;
  sessionsCompleted: number;
  streakLength: number;
  active: boolean;
};

type TempAggData = {
  [type: string]: {
    [property: string]: number;
  };
};
type Result = {
  [type: string]: {
    [property: string]: DataRecord[];
  };
};

export const getAggregatedAnalytics = async (
  userID: string,
  rangeEnum: string,
  sectionType: keyof IAggregatedAnalyticsAll,
): Promise<
  | IAggregatedAnalyticsAll
  | IAggregatedAnalyticsMath
  | IAggregatedAnalyticsWriting
  | IAggregatedAnalyticsReading
  | IAggregatedAnalyticsTrivia
  | null
> => {
  let numOfWeeks = Number.MAX_SAFE_INTEGER;

  if (rangeEnum === "recent") {
    numOfWeeks = 7;
  } else if (rangeEnum === "quarter") {
    numOfWeeks = 13;
  } else if (rangeEnum === "half") {
    numOfWeeks = 7; // 26
  } else if (rangeEnum === "year") {
    numOfWeeks = 15; // 52
  }

  const res = await Analytics.findOne<IAnalytics>(
    { userID },
    { weeklyMetrics: { $slice: [1, numOfWeeks] } },
  );

  let groupSumDict: Record<string, TempAggData> = {};

  let lastDate = new Date();
  let counter = 0;
  const lenOfMetrics = res!.weeklyMetrics.length;
  const groupSize = Math.floor(lenOfMetrics / 12);
  let lastDateMax = new Date();

  // reversing the list
  const reversedWeeklyMetrics = res?.weeklyMetrics.reverse();
  const paddingDate = res!.weeklyMetrics[0].date;

  reversedWeeklyMetrics!.forEach((item: WeeklyMetrics) => {
    let dateVar = `${item.date.getMonth() + 1}/${item.date.getUTCDate()}`;

    // adds to previous date in groups of 2
    if (rangeEnum === "half" && counter % 2 === 1) {
      dateVar = `${lastDate.getMonth() + 1}/${lastDate.getUTCDate()}`;
    }
    // set as mm/yyyy, not mm/dd
    if (rangeEnum === "year") {
      dateVar = `${item.date.getMonth() + 1}/${item.date.getFullYear()}`;
    }
    // group into groups of 12 and put everything into the last object once it goes over
    if (rangeEnum === "max") {
      if (counter % groupSize === 0 && counter < groupSize * 12) {
        lastDateMax = item.date;
        // dateVar = (item.date.getMonth() + 1) + "/" + item.date.getFullYear() as string;
        dateVar = `${
          item.date.getMonth() + 1
        }/${item.date.getUTCDate()}/${item.date.getFullYear()}`;
      } else {
        dateVar = `${
          lastDateMax.getMonth() + 1
        }/${lastDateMax.getUTCDate()}/${lastDateMax.getFullYear()}`;
      }
    }
    counter += 1;
    lastDate = item.date;

    if (groupSumDict[dateVar]) {
      // overall
      groupSumDict[dateVar].overall.totalNum += 1;
      groupSumDict[dateVar].overall.streakLength += item.streakLength;
      // math
      groupSumDict[dateVar].math.totalNum += 1;
      groupSumDict[dateVar].math.questionsCorrect += item.math.questionsCorrect;
      groupSumDict[dateVar].math.avgDifficultyScore +=
        item.math.finalDifficultyScore;
      groupSumDict[dateVar].math.avgQuestionsCompleted +=
        item.math.questionsAttempted;
      groupSumDict[dateVar].math.avgTimePerQuestion +=
        item.math.timePerQuestion;
      // reading
      groupSumDict[dateVar].reading.totalNum += 1;
      groupSumDict[dateVar].reading.sessionCompletion +=
        item.reading.sessionsCompleted;
      groupSumDict[dateVar].reading.stackedValue +=
        item.reading.sessionsAttempted;
      groupSumDict[dateVar].reading.avgWordsPerMin +=
        item.reading.wordsPerMinute;
      groupSumDict[dateVar].reading.avgPassagesRead +=
        item.reading.passagesRead;
      groupSumDict[dateVar].reading.avgTimePerPassage +=
        item.reading.timePerPassage;
      // writing
      groupSumDict[dateVar].writing.totalNum += 1;
      groupSumDict[dateVar].writing.sessionCompletion +=
        item.writing.sessionsCompleted;
      groupSumDict[dateVar].writing.stackedValue +=
        item.writing.sessionsAttempted;
      groupSumDict[dateVar].writing.avgPromptsAnswered +=
        item.writing.questionsAnswered;
      groupSumDict[dateVar].writing.avgTimePerQuestion +=
        item.writing.timePerQuestion;
      // trivia
      groupSumDict[dateVar].trivia.totalNum += 1;
      groupSumDict[dateVar].trivia.questionsCorrect +=
        item.trivia.questionsCorrect;
      groupSumDict[dateVar].trivia.avgQuestionsCompleted +=
        item.trivia.questionsAttempted;
      groupSumDict[dateVar].trivia.avgTimePerQuestion +=
        item.trivia.timePerQuestion;
    } else {
      groupSumDict[dateVar] = {
        overall: {
          totalNum: 1,
          streakLength: item.streakLength,
        },
        math: {
          totalNum: 1,
          avgAccuracy:
            item.math.questionsAttempted === 0
              ? 0
              : item.math.questionsCorrect / item.math.questionsAttempted,
          questionsCorrect: item.math.questionsCorrect,
          avgDifficultyScore: item.math.finalDifficultyScore,
          avgQuestionsCompleted: item.math.questionsAttempted,
          avgTimePerQuestion: item.math.timePerQuestion,
        },
        reading: {
          totalNum: 1,
          sessionCompletion: item.reading.sessionsCompleted,
          stackedValue: item.reading.sessionsAttempted,
          avgWordsPerMin: item.reading.wordsPerMinute,
          avgPassagesRead: item.reading.passagesRead,
          avgTimePerPassage: item.reading.timePerPassage,
        },
        writing: {
          totalNum: 1,
          sessionCompletion: item.writing.sessionsCompleted,
          stackedValue: item.writing.sessionsAttempted,
          avgPromptsAnswered: item.writing.questionsAnswered,
          avgTimePerQuestion: item.writing.timePerQuestion,
        },
        trivia: {
          totalNum: 1,
          avgAccuracy:
            item.trivia.questionsAttempted === 0
              ? 0
              : item.trivia.questionsCorrect / item.trivia.questionsAttempted,
          questionsCorrect: item.trivia.questionsCorrect,
          avgQuestionsCompleted: item.trivia.questionsAttempted,
          avgTimePerQuestion: item.trivia.timePerQuestion,
        },
      };
    }
  });

  Object.keys(groupSumDict).forEach((month) => {
    Object.keys(groupSumDict[month]).forEach((type) => {
      Object.keys(groupSumDict[month][type]).forEach((property) => {
        if (property !== "totalNum" && property !== "avgAccuracy") {
          groupSumDict[month][type][property] /=
            groupSumDict[month][type].totalNum;
        } else if (property === "avgAccuracy") {
          groupSumDict[month][type].avgAccuracy =
            groupSumDict[month][type].avgQuestionsCompleted === 0
              ? 0
              : Math.round(
                  (100 * groupSumDict[month][type].questionsCorrect) /
                    groupSumDict[month][type].avgQuestionsCompleted,
                ) / 100;
        }
      });
    });
  });

  // PADDING
  if (rangeEnum !== "max") {
    let len = Object.keys(groupSumDict).length;

    let totalWeeks = numOfWeeks;
    if (rangeEnum === "half") {
      totalWeeks = 13;
    } else if (rangeEnum === "year") {
      totalWeeks = 12;
    }

    while (len < totalWeeks) {
      if (rangeEnum === "recent" || rangeEnum === "quarter") {
        paddingDate.setDate(paddingDate.getDate() - 7);
      } else if (rangeEnum === "half") {
        paddingDate.setDate(paddingDate.getDate() - 14);
      } else if (rangeEnum === "year") {
        paddingDate.setMonth(paddingDate.getMonth() - 1);
      }

      let tempDateString = `${
        paddingDate.getMonth() + 1
      }/${paddingDate.getUTCDate()}`;
      if (rangeEnum === "year") {
        tempDateString = `${
          paddingDate.getMonth() + 1
        }/${paddingDate.getFullYear()}`;
      }

      groupSumDict = {
        [tempDateString]: {
          overall: {
            streakLength: 0,
          },
          math: {
            avgAccuracy: 0,
            avgDifficultyScore: 0,
            avgQuestionsCompleted: 0,
            avgTimePerQuestion: 0,
          },
          reading: {
            sessionCompletion: 0,
            stackedValue: 0,
            avgWordsPerMin: 0,
            avgPassagesRead: 0,
            avgTimePerPassage: 0,
          },
          writing: {
            sessionCompletion: 0,
            stackedValue: 0,
            avgPromptsAnswered: 0,
            avgTimePerQuestion: 0,
          },
          trivia: {
            avgAccuracy: 0,
            avgQuestionsCompleted: 0,
            avgTimePerQuestion: 0,
          },
        },
        ...groupSumDict,
      };

      len += 1;
    }
  }

  const result: Result = {
    overall: {
      streakHistory: [],
    },
    math: {
      avgAccuracy: [],
      avgDifficultyScore: [],
      avgQuestionsCompleted: [],
      avgTimePerQuestion: [],
    },
    reading: {
      sessionCompletion: [],
      avgWordsPerMin: [],
      avgPassagesRead: [],
      avgTimePerPassage: [],
    },
    writing: {
      sessionCompletion: [],
      avgPromptsAnswered: [],
      avgTimePerQuestion: [],
    },
    trivia: {
      avgAccuracy: [],
      avgQuestionsCompleted: [],
      avgTimePerQuestion: [],
    },
  };

  Object.keys(groupSumDict).forEach((month) => {
    Object.keys(groupSumDict[month]).forEach((type) => {
      Object.keys(groupSumDict[month][type]).forEach((property) => {
        if (property === "totalNum" || property === "stackedValue") {
          return;
        }

        let dr = [
          {
            interval: month,
            value: groupSumDict[month][type][property],
          } as DataRecord,
        ];

        if (property === "sessionCompletion") {
          dr = [
            {
              interval: month,
              value: groupSumDict[month][type][property],
              stackedValue: groupSumDict[month][type].sessionCompletion,
            } as StackedDataRecord,
          ];
        }
        if (!result[type][property]) {
          result[type][property] = dr;
        } else {
          result[type][property] = result[type][property].concat(dr);
        }
      });
    });
  });

  // if overshoot, remove last element
  // const groupSumArray = Object.values(groupSumDict)
  // if ((groupSumArray.length === 4 && rangeEnum === "quarter") ||
  //       (groupSumArray.length === 7 && rangeEnum === "half") ||
  //       (groupSumArray.length === 13 && rangeEnum === "year")) {
  //   groupSumArray.pop()
  // }

  const finalAggregation = {
    overall: {
      ...result.overall,
      streak: res!.streak,
      startDate: res!.startDate,
      lastSessionDate: res!.lastSessionMetrics.date,
      totalSessionsCompleted: res!.totalSessionsCompleted,
      lastSession: {
        mathQuestionsCompleted: res!.lastSessionMetrics.math.questionsAttempted,
        wordsRead: res!.lastSessionMetrics.reading.passagesRead,
        promptsCompleted: res!.lastSessionMetrics.writing.questionsAnswered, // writing
        triviaQuestionsCompleted:
          res!.lastSessionMetrics.trivia.questionsAttempted,
      },
    },
    math: {
      ...result.math,
      lastSession: {
        accuracy:
          res!.lastSessionMetrics.math.questionsAttempted === 0
            ? 0
            : res!.lastSessionMetrics.math.questionsCorrect /
              res!.lastSessionMetrics.math.questionsAttempted,
        difficultyScore: res!.lastSessionMetrics.math.finalDifficultyScore,
        questionsCompleted: res!.lastSessionMetrics.math.questionsAttempted,
        timePerQuestion: res!.lastSessionMetrics.math.timePerQuestion,
      },
    },
    reading: {
      ...result.reading,
      lastSession: {
        passagesRead: res!.lastSessionMetrics.reading.passagesRead,
        timePerPassage: res!.lastSessionMetrics.reading.timePerPassage,
        completed: res!.lastSessionMetrics.reading.questionsAnswered !== 0,
      },
    },
    writing: {
      ...result.writing,
      lastSession: {
        promptsAnswered: res!.lastSessionMetrics.writing.questionsAnswered,
        timePerPrompt: res!.lastSessionMetrics.writing.timePerQuestion,
        completed: res!.lastSessionMetrics.writing.questionsAnswered !== 0,
      },
    },
    trivia: {
      ...result.trivia,
      lastSession: {
        accuracy:
          res!.lastSessionMetrics.trivia.questionsAttempted === 0
            ? 0
            : res!.lastSessionMetrics.trivia.questionsCorrect /
              res!.lastSessionMetrics.trivia.questionsAttempted,
        questionsCompleted: res!.lastSessionMetrics.trivia.questionsAttempted,
        timePerQuestion: res!.lastSessionMetrics.trivia.timePerQuestion,
      },
    },
  } as IAggregatedAnalyticsAll;

  if (sectionType === "overall") {
    return finalAggregation;
  }

  type SectionInterface =
    | IAggregatedAnalyticsMath
    | IAggregatedAnalyticsReading
    | IAggregatedAnalyticsTrivia
    | IAggregatedAnalyticsWriting;
  const selectedPortion = finalAggregation[sectionType] || {};

  const section = {
    [sectionType]: selectedPortion,
  } as unknown as SectionInterface;

  return section;
};
