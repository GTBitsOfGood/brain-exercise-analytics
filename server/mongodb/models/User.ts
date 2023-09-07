import mongoose from "mongoose";
import { Role } from "@/common_utils/types";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  birthDate: {
    type: Date,
    default: new Date(),
  },
  signedUp: {
    type: Boolean,
    default: true,
  },
  secondaryContactName: {
    type: String,
    default: "",
  },
  secondaryContactPhone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: {
      values: Object.values(Role),
    },
    default: Role.NONPROFIT_USER,
  },
});

const User = mongoose.models?.User ?? mongoose.model("User", UserSchema);
export default User;
