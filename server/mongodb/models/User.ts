import mongoose from "mongoose";
import { AdminApprovalStatus, Role } from "@/common_utils/types";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    // index: true,
    // unique: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  birthDate: {
    type: Date,
    default: Date(),
  },
  startDate: {
    type: Date,
    default: Date(),
  },
  patientDetails: {
    type: {
      secondaryContactName: String,
      secondaryContactPhone: String,
      additionalAffiliation: String,
    },
    default: {
      birthDate: new Date(),
      secondaryContactName: "",
      secondaryContactPhone: "",
      additionalAffiliation: "",
    },
  },
  adminDetails: {
    type: {
      active: Boolean,
    },
    default: {
      active: true,
    },
  },
  chapter: {
    type: String,
    default: "",
  },
  location: {
    type: {
      country: String,
      state: String,
      city: String,
    },
    default: {
      country: "",
      state: "",
      city: "",
    },
  },
  signedUp: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: String,
    enum: {
      values: Object.values(AdminApprovalStatus),
    },
    default: AdminApprovalStatus.PENDING,
  },
  role: {
    type: String,
    enum: {
      values: Object.values(Role),
    },
    default: Role.NONPROFIT_PATIENT,
  },
  imageLink: {
    type: String,
    default: "",
  },
});

const User = mongoose.models?.User ?? mongoose.model("User", UserSchema);
export default User;
