/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPatientSearchReducer, RecursivePartial } from "@/common_utils/types";

const initialState: IPatientSearchReducer = {
  fullName: "",
  active: undefined,
  countries: new Array<string>(),
  states: new Array<string>(),
  cities: new Array<string>(),
  dateOfBirths: new Array<string>(),
  emails: new Array<string>(),
  additionalAffiliations: new Array<string>(),
  dateOfJoins: new Array<string>(),
  beiChapters: new Array<string>(),
  secondaryPhones: new Array<string>(),
  secondaryNames: new Array<string>(),
};

// Helper function to copy all properties from newState over to the existing state
const setState = (
  state: IPatientSearchReducer,
  newState: RecursivePartial<IPatientSearchReducer>,
): IPatientSearchReducer => {
  state.fullName = newState.fullName ?? state.fullName;
  state.active = "active" in newState ? newState.active : state.active;
  state.countries = newState.countries ?? state.countries;
  state.states = newState.states ?? state.states;
  state.cities = newState.cities ?? state.cities;
  state.dateOfBirths = newState.dateOfBirths ?? state.dateOfBirths;
  state.emails = newState.emails ?? state.emails;
  state.additionalAffiliations =
    newState.additionalAffiliations ?? state.additionalAffiliations;
  state.dateOfJoins = newState.dateOfJoins ?? state.dateOfJoins;
  state.beiChapters = newState.beiChapters ?? state.beiChapters;
  state.secondaryPhones =
    newState.secondaryPhones ?? state.secondaryPhones;
  state.secondaryNames = newState.secondaryNames ?? state.secondaryNames;

  return state;
};

const patientSearchReducer = createSlice({
  name: "patientSearch",
  initialState,
  reducers: {
    update(
      state,
      action: PayloadAction<RecursivePartial<IPatientSearchReducer>>,
    ) {
      setState(state, action.payload);
    },
    clear(state) {
      setState(state, initialState);
    },
  },
});

export const { update, clear } = patientSearchReducer.actions;

export default patientSearchReducer.reducer;
