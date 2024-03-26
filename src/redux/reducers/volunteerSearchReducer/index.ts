/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IVolunteerSearchReducer } from "@/common_utils/types";

const initialState: IVolunteerSearchReducer = {
  fullName: "",
  active: undefined,
  countries: new Set<string>(),
  states: new Set<string>(),
  cities: new Set<string>(),
  dateOfBirths: new Set<string>(),
  emails: new Set<string>(),
  dateOfJoins: new Set<string>(),
  beiChapters: new Set<string>(),
  volunteerRoles: new Set<string>(),
};

const volunteerSearchReducer = createSlice({
  name: "volunteerSearch",
  initialState,
  reducers: {
    setFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    setActive(state, action: PayloadAction<boolean | undefined>) {
      state.active = action.payload;
    },
    setCountries(state, action: PayloadAction<Set<string>>) {
      state.countries = action.payload;
    },
    setStates(state, action: PayloadAction<Set<string>>) {
      state.states = action.payload;
    },
    setCities(state, action: PayloadAction<Set<string>>) {
      state.cities = action.payload;
    },
    setDateOfBirths(state, action: PayloadAction<Set<string>>) {
      state.dateOfBirths = action.payload;
    },
    setEmails(state, action: PayloadAction<Set<string>>) {
      state.emails = action.payload;
    },
    setDateOfJoins(state, action: PayloadAction<Set<string>>) {
      state.dateOfJoins = action.payload;
    },
    setBeiChapters(state, action: PayloadAction<Set<string>>) {
      state.beiChapters = action.payload;
    },
    setVolunteerRoles(state, action: PayloadAction<Set<string>>) {
      state.volunteerRoles = action.payload;
    },
    resetFields(state) {
      state.fullName = initialState.fullName;
      state.active = initialState.active;
      state.countries = initialState.countries;
      state.states = initialState.states;
      state.cities = initialState.cities;
      state.dateOfBirths = initialState.dateOfBirths;
      state.emails = initialState.emails;
      state.dateOfJoins = initialState.dateOfJoins;
      state.beiChapters = initialState.beiChapters;
      state.volunteerRoles = initialState.volunteerRoles;
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
  setDateOfJoins,
  setBeiChapters,
  setVolunteerRoles,
  resetFields,
} = volunteerSearchReducer.actions;

export default volunteerSearchReducer.reducer;
