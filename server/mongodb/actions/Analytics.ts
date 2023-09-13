import Analytics from "@server/mongodb/models/Analytics";
import { Days } from "@/common_utils/types";

export const getAnalyticsByID = async (userID: string) => {
  const analytics = await Analytics.findOne({ userID });
  return analytics;
};

export const createAnalyticsID = async (userID: string) => {
  const analytics = await Analytics.create({ userID });
  return analytics;
};

// modify math function that sets and updates the object with the userID.
export const modifyMath = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
  difficultyScore: number,
) => {
  const weightedDiff =
    (Number(questionsAttempted) / 100) * Number(difficultyScore);

  let data;
  try {
    data = await Analytics.findOneAndUpdate(
      { userID },
      {
        $set: {
          "lastSessionMetrics.math.questionsAttempted": questionsAttempted,
          "lastSessionMetrics.math.questionsCorrect": questionsCorrect,
          "lastSessionMetrics.math.timePerQuestion": timePerQuestion,
          "lastSessionMetrics.math.finalDifficultyScore": weightedDiff,
        },
        $inc: {
          "weeklyMetrics.0.math.sessionsCompleted": 1,
          "weeklyMetrics.0.math.questionsAttempted": questionsAttempted,
          "weeklyMetrics.0.math.questionsCorrect": questionsCorrect,
          "weeklyMetrics.0.math.timePerQuestion": timePerQuestion, // this can be changed to total time to better account for different number of questions attempted
          "weeklyMetrics.0.math.finalDifficultyScore": weightedDiff,
        },
      },
    );
  } catch (error) {
    return error;
  }
  return data;
};

// modifyTrivia function
export const modifyTrivia = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
) => {
  await Analytics.findOneAndUpdate(
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
  );
};

// modifyReading function
export const modifyReading = async (
  userID: string,
  completed: boolean,
  passagesRead: number,
) => {
  const increment = completed ? 1 : 0;

  await Analytics.findOneAndUpdate(
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
  );
};

// modifySessionComplete function
export const updateSessionComplete = async (userID: string) => {
  const getDayString = (day: number) => {
    if (day === 0) {
      return Days.SS;
    }
    if (day === 1) {
      return Days.M;
    }
    if (day === 2) {
      return Days.T;
    }
    if (day === 3) {
      return Days.W;
    }
    if (day === 4) {
      return Days.T;
    }
    if (day === 5) {
      return Days.F;
    }
    if (day === 6) {
      return Days.S;
    }
    return "";
  };

  const today = new Date();
  const dayOfWeek = getDayString(today.getDay());

  await Analytics.findOneAndUpdate(
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
  );
};
