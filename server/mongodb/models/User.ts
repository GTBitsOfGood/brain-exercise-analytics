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
  patientDetails: {
    type: Map,
    default: {
      birthDate: new Date(),
      signedUp: false,
      secondaryContactName: "",
      secondaryContactPhone: "",
    },
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
