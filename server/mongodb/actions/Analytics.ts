import Analytics from "@server/mongodb/models/Analytics";
import { Days, IAnalytics } from "@/common_utils/types";
// import { incrementActiveUsers, incrementTotalUsers } from "./OverallAnalytics";

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
