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

export const getAggregatedAnalytics = async (
  userID: string,
  // rangeEnum: string
  sectionType: keyof IAggregatedAnalyticsAll,
): Promise<
  | IAggregatedAnalyticsAll
  | IAggregatedAnalyticsMath
  | IAggregatedAnalyticsWriting
  | IAggregatedAnalyticsReading
  | IAggregatedAnalyticsTrivia
  | null
> => {
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
    overall: {
      streakLength: number;
    };
    math: {
      // totalNum: item.math.questionsAttempted === 0 ? 0 : 1,
      avgAccuracy: number;
      avgDifficultyScore: number;
      avgQuestionsCompleted: number;
      avgTimePerQuestion: number;
    };
    reading: {
      // totalNum: item.reading.sessionsAttempted === 0 ? 0 : 1,
      sessionCompletion: number;
      stackedValue: number;
      avgWordsPerMin: number;
      avgPassagesRead: number;
      avgTimePerPassage: number;
    };
    writing: {
      // totalNum: item.writing.sessionsAttempted === 0 ? 0 : 1,
      sessionCompletion: number;
      stackedValue: number;
      avgPromptsAnswered: number;
      avgTimePerQuestion: number;
    };
    trivia: {
      // totalNum: item.trivia.questionsAttempted === 0 ? 0 : 1,
      avgAccuracy: number;
      avgQuestionsCompleted: number;
      avgTimePerQuestion: number;
    };
  };
  type Result = {
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
  };

  const numOfWeeks = 7;

  const res = await Analytics.findOne<IAnalytics>(
    { userID },
    { weeklyMetrics: { $slice: [1, numOfWeeks] } },
  );

  const groupSumDict: Record<string, TempAggData> = {};
  let lastDate = new Date();

  res!.weeklyMetrics.forEach((item: WeeklyMetrics) => {
    // let dateVar = item.date.getMonth() + "/" + item.date.getFullYear() as string;
    // if (rangeEnum === "recent") {
    // set as mm/dd, not mm/yyyy
    const dateVar = `${item.date.getMonth() + 1}/${item.date.getUTCDate()}`;
    lastDate = item.date;
    //    }

    // if(groupSumDict[dateVar]) {
    // groupSumDict[dateVar].math.avgAccuracy += item.math.questionsCorrect
    // } else {
    groupSumDict[dateVar] = {
      overall: {
        streakLength: item.streakLength,
      },
      math: {
        // totalNum: item.math.questionsAttempted === 0 ? 0 : 1,
        avgAccuracy:
          item.math.questionsAttempted === 0
            ? 0
            : item.math.questionsCorrect / item.math.questionsAttempted,
        avgDifficultyScore: item.math.finalDifficultyScore,
        avgQuestionsCompleted: item.math.questionsAttempted,
        avgTimePerQuestion: item.math.timePerQuestion,
      },
      reading: {
        // totalNum: item.reading.sessionsAttempted === 0 ? 0 : 1,
        sessionCompletion: item.reading.sessionsCompleted,
        stackedValue: item.reading.sessionsAttempted,
        avgWordsPerMin: item.reading.wordsPerMinute,
        avgPassagesRead: item.reading.passagesRead,
        avgTimePerPassage: item.reading.timePerPassage,
      },
      writing: {
        // totalNum: item.writing.sessionsAttempted === 0 ? 0 : 1,
        sessionCompletion: item.writing.sessionsCompleted,
        stackedValue: item.writing.sessionsAttempted,
        avgPromptsAnswered: item.writing.questionsAnswered,
        avgTimePerQuestion: item.writing.timePerQuestion,
      },
      trivia: {
        // totalNum: item.trivia.questionsAttempted === 0 ? 0 : 1,
        avgAccuracy:
          item.trivia.questionsAttempted === 0
            ? 0
            : item.trivia.questionsCorrect / item.trivia.questionsAttempted,
        avgQuestionsCompleted: item.trivia.questionsAttempted,
        avgTimePerQuestion: item.trivia.timePerQuestion,
      },
      // }
    };
  });

  let len = Object.keys(groupSumDict).length;
  while (len < numOfWeeks) {
    lastDate.setDate(lastDate.getDate() - 7);
    const tempDateString = `${
      lastDate.getMonth() + 1
    }/${lastDate.getUTCDate()}`;
    groupSumDict[tempDateString] = {
      overall: {
        streakLength: 0,
      },
      math: {
        // totalNum: 0,
        avgAccuracy: 0,
        avgDifficultyScore: 0,
        avgQuestionsCompleted: 0,
        avgTimePerQuestion: 0,
      },
      reading: {
        // totalNum: 0,
        sessionCompletion: 0,
        stackedValue: 0,
        avgWordsPerMin: 0,
        avgPassagesRead: 0,
        avgTimePerPassage: 0,
      },
      writing: {
        // totalNum: 0,
        sessionCompletion: 0,
        stackedValue: 0,
        avgPromptsAnswered: 0,
        avgTimePerQuestion: 0,
      },
      trivia: {
        // totalNum: 0,
        avgAccuracy: 0,
        avgQuestionsCompleted: 0,
        avgTimePerQuestion: 0,
      },
    };
    len += 1;
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

  for (const month in groupSumDict) {
    for (const type in groupSumDict[month]) {
      for (const property in groupSumDict[month][type]) {
        if (property === "totalNum" || property === "stackedValue") {
          continue;
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
        result[type][property] = dr.concat(result[type][property]);
      }
    }
  }

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
