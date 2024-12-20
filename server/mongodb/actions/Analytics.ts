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
  const analytics = (await Analytics.create({
    userID,
  })) as IAnalytics;
  return analytics;
};

// check if there is a new session in a new date
const checkNewDate = async (userID: string): Promise<null> => {
  const analytics = await Analytics.findOne<IAnalytics>({ userID });
  const today = new Date();

  if (
    analytics?.lastSessionMetrics.date.getDay() !== today.getDay() ||
    analytics?.lastSessionMetrics.date.getMonth() !== today.getMonth() ||
    analytics?.lastSessionMetrics.date.getFullYear() !== today.getFullYear()
  ) {
    await Analytics.findOneAndUpdate({ userID }, [
      // {
      //   $set: {
      //     lastSessionsMetrics: {
      //       $cond: {
      //         if: { $gt: [{ $size: "$lastSessionsMetrics" }, 1] },
      //         then: { $slice: ["$lastSessionsMetrics", 1] },
      //         else: "$lastSessionsMetrics",
      //       },
      //     },
      //   },
      // },
      // {
      //   $set: {
      //     lastSessionsMetrics: {
      //       $concatArrays: [
      //         [
      //           {
      //             date: today,
      //             math: {
      //               attempted: false,
      //               questionsAttempted: 0,
      //               questionsCorrect: 0,
      //               finalDifficultyScore: 0,
      //               timePerQuestion: 0,
      //             },
      //             trivia: {
      //               attempted: false,
      //               questionsAttempted: 0,
      //               questionsCorrect: 0,
      //               timePerQuestion: 0,
      //             },
      //             reading: {
      //               attempted: false,
      //               passagesRead: 0,
      //               timePerPassage: 0,
      //               wordsPerMinute: 0,
      //               skipped: true,
      //             },
      //             writing: {
      //               attempted: false,
      //               questionsAnswered: 0,
      //               timePerQuestion: 0,
      //               skipped: true,
      //             },
      //           },
      //         ],
      //         "$lastSessionsMetrics",
      //       ],
      //     },
      //   },
      // },
    ]);
  }
  return null;
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
        "lastSessionsMetrics.0.date": today,
      },
    },
    { new: true },
  );

  return data;
};

// check if categories are attempted
const checkSessionComplete = async (userID: string): Promise<null> => {
  const analytics = await Analytics.findOne<IAnalytics>({ userID });

  if (
    analytics?.lastSessionMetrics.math.attempted &&
    analytics?.lastSessionMetrics.trivia.attempted &&
    analytics?.lastSessionMetrics.reading.attempted &&
    analytics?.lastSessionMetrics.writing.attempted
  ) {
    await updateSessionComplete(userID);
  }

  return null;
};

// modify math function that sets and updates the object with the userID.
export const modifyMath = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
  difficultyScore: number,
): Promise<IAnalytics | null> => {
  await checkNewDate(userID);

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionsMetrics.0.math.attempted": true,
        "lastSessionsMetrics.0.math.questionsAttempted": questionsAttempted,
        "lastSessionsMetrics.0.math.questionsCorrect": questionsCorrect,
        "lastSessionsMetrics.0.math.timePerQuestion": timePerQuestion,
        "lastSessionsMetrics.0.math.finalDifficultyScore": difficultyScore,
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

  checkSessionComplete(userID);

  return data;
};

// modifyTrivia function
export const modifyTrivia = async (
  userID: string,
  questionsAttempted: number,
  questionsCorrect: number,
  timePerQuestion: number,
): Promise<IAnalytics | null> => {
  await checkNewDate(userID);

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionsMetrics.0.trivia.attempted": true,
        "lastSessionsMetrics.0.trivia.questionsAttempted": questionsAttempted,
        "lastSessionsMetrics.0.trivia.questionsCorrect": questionsCorrect,
        "lastSessionsMetrics.0.trivia.timePerQuestion": timePerQuestion,
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

  checkSessionComplete(userID);

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
  await checkNewDate(userID);

  const increment = completed ? 1 : 0;

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionsMetrics.0.reading.attempted": true,
        "lastSessionsMetrics.0.reading.passagesRead": passagesRead,
        "lastSessionsMetrics.0.reading.timePerPassage": timePerPassage,
        "lastSessionsMetrics.0.reading.wordsPerMinute": wordsPerMinute,
        "lastSessionsMetrics.0.reading.skipped": !completed,
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

  checkSessionComplete(userID);

  return data;
};

export const modifyWriting = async (
  userID: string,
  completed: boolean,
  questionsAnswered: number,
  timePerQuestion: number,
): Promise<IAnalytics | null> => {
  await checkNewDate(userID);

  const increment = completed ? 1 : 0;

  const data = await Analytics.findOneAndUpdate<IAnalytics>(
    { userID },
    {
      $set: {
        "lastSessionsMetrics.0.writing.attempted": true,
        "lastSessionsMetrics.0.writing.questionsAnswered": questionsAnswered,
        "lastSessionsMetrics.0.writing.timePerQuestion": timePerQuestion,
        "lastSessionsMetrics.0.writing.skipped": !completed,
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

  checkSessionComplete(userID);

  return data;
};

export const getAnalyticsByUserId = async (
  userID: string,
): Promise<IAnalytics | null> => {
  const analytics = await Analytics.findOne<IAnalytics>({ userID });

  return analytics as IAnalytics;
};
