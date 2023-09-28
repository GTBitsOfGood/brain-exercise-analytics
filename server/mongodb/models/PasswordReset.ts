import mongoose from "mongoose";

const { Schema } = mongoose;

const PasswordResetSchema = new Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  token: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
  expiryDate: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
});

const PasswordReset =
  mongoose.models?.PasswordReset ??
  mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordReset;
