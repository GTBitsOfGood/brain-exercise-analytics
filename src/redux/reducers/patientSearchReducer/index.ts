/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPatientSearchReducer } from "@/common_utils/types";

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
  secondaryPhoneNumbers: new Array<string>(),
  secondaryNames: new Array<string>(),
};

const patientSearchReducer = createSlice({
  name: "patientSearch",
  initialState,
  reducers: {
    setFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    setActive(state, action: PayloadAction<boolean | undefined>) {
      state.active = action.payload;
    },
    setCountries(state, action: PayloadAction<Array<string>>) {
      state.countries = action.payload;
    },
    setStates(state, action: PayloadAction<Array<string>>) {
      state.states = action.payload;
    },
    setCities(state, action: PayloadAction<Array<string>>) {
      state.cities = action.payload;
    },
    setDateOfBirths(state, action: PayloadAction<Array<string>>) {
      state.dateOfBirths = action.payload;
    },
    setEmails(state, action: PayloadAction<Array<string>>) {
      state.emails = action.payload;
    },
    setAdditionalAffiliations(state, action: PayloadAction<Array<string>>) {
      state.additionalAffiliations = action.payload;
    },
    setDateOfJoins(state, action: PayloadAction<Array<string>>) {
      state.dateOfJoins = action.payload;
    },
    setBeiChapters(state, action: PayloadAction<Array<string>>) {
      state.beiChapters = action.payload;
    },
    setSecondaryPhoneNumbers(state, action: PayloadAction<Array<string>>) {
      state.secondaryPhoneNumbers = action.payload;
    },
    setSecondaryNames(state, action: PayloadAction<Array<string>>) {
      state.secondaryNames = action.payload;
    },
    resetFields(state) {
      state.fullName = initialState.fullName;
      state.active = initialState.active;
      state.countries = initialState.countries;
      state.states = initialState.states;
      state.cities = initialState.cities;
      state.dateOfBirths = initialState.dateOfBirths;
      state.emails = initialState.emails;
      state.additionalAffiliations = initialState.additionalAffiliations;
      state.dateOfJoins = initialState.dateOfJoins;
      state.beiChapters = initialState.beiChapters;
      state.secondaryPhoneNumbers = initialState.secondaryPhoneNumbers;
      state.secondaryNames = initialState.secondaryNames;
    },
  },
});

export const {
  setFullName,
  setActive,
  setCountries,
  setStates,
  setCities,
  setDateOfBirths,
  setEmails,
  setAdditionalAffiliations,
  setDateOfJoins,
  setBeiChapters,
  setSecondaryPhoneNumbers,
  setSecondaryNames,
  resetFields,
} = patientSearchReducer.actions;

export default patientSearchReducer.reducer;
