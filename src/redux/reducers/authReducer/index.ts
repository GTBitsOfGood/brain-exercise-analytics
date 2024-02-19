/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminApprovalStatus,
  IUser,
  RecursivePartial,
  Role,
} from "@/common_utils/types";
import { deleteCookie } from "cookies-next";

const initialState: IUser = {
  _id: "",
  name: "",
  email: "",
  phoneNumber: "",
  patientDetails: {
    birthDate: new Date(),
    secondaryContactName: "",
    secondaryContactPhone: "",
    additionalAffiliation: "",
  },
  adminDetails: {
    active: true,
  },
  chapter: "",
  location: {
    country: "",
    state: "",
    city: "",
  },
  signedUp: false,
  verified: false,
  approved: AdminApprovalStatus.PENDING,
  role: Role.NONPROFIT_PATIENT,
};

// Helper function to copy all properties from newState over to the existing state
const setState = (state: IUser, newState: RecursivePartial<IUser>): IUser => {
  state._id = newState._id ?? state._id;
  state.name = newState.name ?? state.name;
  state.email = newState.email ?? state.email;
  state.phoneNumber = newState.phoneNumber ?? state.phoneNumber;
  state.patientDetails = {
    birthDate:
      newState.patientDetails?.birthDate ?? state.patientDetails.birthDate,
    secondaryContactName:
      newState.patientDetails?.secondaryContactName ??
      state.patientDetails.secondaryContactName,
    secondaryContactPhone:
      newState.patientDetails?.secondaryContactPhone ??
      state.patientDetails.secondaryContactPhone,
    additionalAffiliation:
      newState.patientDetails?.additionalAffiliation ??
      state.patientDetails.additionalAffiliation,
  };
  state.adminDetails = {
    active: newState.adminDetails?.active ?? state.adminDetails.active,
  };
  state.chapter = newState.chapter ?? state.chapter;
  state.location = {
    country: newState.location?.country ?? state.location.country,
    state: newState.location?.state ?? state.location.state,
    city: newState.location?.city ?? state.location.city,
  };
  state.signedUp =
    newState.signedUp === undefined ? state.signedUp : newState.signedUp;
  state.verified =
    newState.verified === undefined ? state.verified : newState.verified;
  state.approved = newState.approved ?? state.approved;
  state.role = newState.role ?? state.role;
  return state;
};

const authReducer = createSlice({
  name: "authInfo",
  initialState,
  reducers: {
    // Update the authState with the user information
    update(state, action: PayloadAction<Partial<IUser>>) {
      setState(state, action.payload);
    },
    // Clear the authState
    logout(state) {
      deleteCookie("authUser", { path: "/" });
      setState(state, initialState);
    },
    setFirstTimeLogin(state, action: PayloadAction<boolean>) {
      state.signedUp = action.payload;
    },
  },
});

export const { update, logout, setFirstTimeLogin } = authReducer.actions;

export default authReducer.reducer;
