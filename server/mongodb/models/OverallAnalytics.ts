import { getCurrentMonday } from "@server/utils/utils";
import mongoose from "mongoose";

const { Schema } = mongoose;

const OverallAnalyticsSchema = new Schema({
  totalUsers: {
    type: Number,
    default: 0,
  },
  activeUsers: {
    type: Number,
    default: 0,
  },
  weeklyMetrics: {
    type: [
      {
        date: Date,
        totalUsers: Number,
        activeUsers: Number,
      },
    ],
    default: [
      {
        date: getCurrentMonday(),
        totalUsers: 0,
        activeUsers: 0,
      },
    ],
  },
});

const OverallAnalytics =
  mongoose.models?.OverallAnalytics ??
  mongoose.model("OverallAnalytics", OverallAnalyticsSchema);
export default OverallAnalytics;
