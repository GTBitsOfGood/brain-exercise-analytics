/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IVolunteerSearchReducer,
  RecursivePartial,
} from "@/common_utils/types";

const initialState: IVolunteerSearchReducer = {
  fullName: "",
  active: undefined,
  countries: new Array<string>(),
  states: new Array<string>(),
  cities: new Array<string>(),
  dateOfBirths: new Array<string>(),
  emails: new Array<string>(),
  dateOfJoins: new Array<string>(),
  beiChapters: new Array<string>(),
  volunteerRoles: new Array<string>(),
};

// Helper function to copy all properties from newState over to the existing state
const setState = (
  state: IVolunteerSearchReducer,
  newState: RecursivePartial<IVolunteerSearchReducer>,
): IVolunteerSearchReducer => {
  state.fullName = newState.fullName ?? state.fullName;
  state.active = "active" in newState ? newState.active : state.active;
  state.countries = newState.countries ?? state.countries;
  state.states = newState.states ?? state.states;
  state.cities = newState.cities ?? state.cities;
  state.dateOfBirths = newState.dateOfBirths ?? state.dateOfBirths;
  state.emails = newState.emails ?? state.emails;
  state.dateOfJoins = newState.dateOfJoins ?? state.dateOfJoins;
  state.beiChapters = newState.beiChapters ?? state.beiChapters;
  state.volunteerRoles = newState.volunteerRoles ?? state.volunteerRoles;

  return state;
};

const volunteerSearchReducer = createSlice({
  name: "volunteerSearch",
  initialState,
  reducers: {
    update(
      state,
      action: PayloadAction<RecursivePartial<IVolunteerSearchReducer>>,
    ) {
      setState(state, action.payload);
    },
    clear(state) {
      setState(state, initialState);
    },
  },
});

export const { update, clear } = volunteerSearchReducer.actions;

export default volunteerSearchReducer.reducer;
