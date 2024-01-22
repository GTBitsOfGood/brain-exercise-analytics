import { VerificationLogType } from "@/common_utils/types";
import mongoose from "mongoose";

const { Schema } = mongoose;

const VerificationLogSchema = new Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    enum: VerificationLogType,
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
    expires: 60 * 60 * 24 * 7, // 7 days
  },
});

const VerificationLog =
  mongoose.models?.VerificationLog ??
  mongoose.model("VerificationLog", VerificationLogSchema);
export default VerificationLog;
