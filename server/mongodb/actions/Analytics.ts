import Analytics from "@server/mongodb/models/Analytics";
import { StringMappingType } from "typescript";
import { Days } from "@/common_utils/types";

export const getAnalyticsByID = async (userID: string) => {
  const analytics = await Analytics.findOne({ userID });
  return analytics;
};

export const createAnalyticsID = async (userID: string) => {
  const analytics = await Analytics.create({ userID });
  return analytics;
};

//modify math function that sets and updates the object with the userID.
export const modifyMath = async (
  userID: string,
  questionsAttempted: Number,
  questionsCorrect: Number,
  timePerQuestion: Number,
  difficultyScore: Number,
) => {
  const weightedDiff =
    (Number(questionsAttempted) / 100) * Number(difficultyScore);

  try {
    const result = await Analytics.findOneAndUpdate(
      { userID: userID },
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
          "weeklyMetrics.0.math.timePerQuestion": timePerQuestion, //this can be changed to total time to better account for different number of questions attempted
          "weeklyMetrics.0.math.finalDifficultyScore": weightedDiff,
        },
      },
    );
  } catch (error) {
    console.log(error);
  }

  return;
};

//modifyTrivia function
export const modifyTrivia = async (
  userID: string,
  questionsAttempted: Number,
  questionsCorrect: Number,
  timePerQuestion: Number,
) => {
  const result = await Analytics.findOneAndUpdate(
    { userID: userID },
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
        "weeklyMetrics.0.trivia.timePerQuestion": timePerQuestion, //this can be changed to total time to better account for different number of questions attempted
      },
    },
  );

  return;
};

//modifyReading function
export const modifyReading = async (
  userID: string,
  completed: boolean,
  passagesRead: Number,
) => {
  const increment = completed ? 1 : 0;

  const result = await Analytics.findOneAndUpdate(
    { userID: userID },
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

  return;
};

//modifyReading function
export const updateSessionComplete = async (userID: string) => {
  const getDayString = (day: Number) => {
    if (day === 0) {
      return Days.SS;
    } else if (day == 1) {
      return Days.M;
    } else if (day == 2) {
      return Days.T;
    } else if (day == 3) {
      return Days.W;
    } else if (day == 4) {
      return Days.T;
    } else if (day == 5) {
      return Days.F;
    } else if (day == 6) {
      return Days.S;
    }
    return "";
  };

  const today = new Date();
  const dayOfWeek = getDayString(today.getDay());
  console.log(dayOfWeek);
  console.log(dayOfWeek);

  const result = await Analytics.findOneAndUpdate(
    { userID: userID },
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

  return;
};
