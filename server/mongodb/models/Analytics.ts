import mongoose from "mongoose";
import { Days } from "@/common_utils/types";
import { getCurrentMonday } from "@server/utils/utils";

const { Schema } = mongoose;

const AnalyticsSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
  },
  totalSessionsCompleted: {
    type: Number,
    default: 0,
  },
  streak: {
    type: [String],
    enum: {
      values: Object.values(Days),
    },
    default: [],
  },
  lastSessionMetrics: {
    type: {
      math: {
        questionsAttempted: Number,
        questionsCorrect: Number,
        finalDifficultyScore: Number,
        timePerQuestion: Number,
      },
      trivia: {
        questionsAttempted: Number,
        questionsCorrect: Number,
        timePerQuestion: Number,
      },
      reading: {
        passagesRead: Number,
      },
    },
    default: {
      math: {
        questionsAttempted: 0,
        questionsCorrect: 0,
        finalDifficultyScore: 0,
        timePerQuestion: 0,
      },
      trivia: {
        questionsAttempted: 0,
        questionsCorrect: 0,
        timePerQuestion: 0,
      },
      reading: {
        passagesRead: 0,
      },
    },
  },
  weeklyMetrics: {
    type: [
      {
        date: Date,
        sessionsCompleted: Number,
        streakLength: Number,
        math: {
          sessionsCompleted: Number,
          questionsAttempted: Number,
          questionsCorrect: Number,
          finalDifficultyScore: Number,
          timePerQuestion: Number,
        },
        trivia: {
          sessionsCompleted: Number,
          questionsAttempted: Number,
          questionsCorrect: Number,
          timePerQuestion: Number,
        },
        reading: {
          sessionsAttempted: Number,
          sessionsCompleted: Number,
          passagesRead: Number,
        },
      },
    ],
    default: [
      {
        date: getCurrentMonday(),
        sessionsCompleted: 0,
        streakLength: 0,
        math: {
          sessionsCompleted: 0,
          questionsAttempted: 0,
          questionsCorrect: 0,
          finalDifficultyScore: 0.0,
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
  },
});

const Analytics =
  mongoose.models?.Analytics ?? mongoose.model("Analytics", AnalyticsSchema);
export default Analytics;
