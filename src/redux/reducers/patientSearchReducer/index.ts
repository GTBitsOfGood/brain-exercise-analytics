import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPatientSearchReducer } from '@/common_utils/types';

const initialState: IPatientSearchReducer = {
  fullName: '',
  active: undefined,
  countries: new Set<string>(),
  states: new Set<string>(),
  cities: new Set<string>(),
  dateOfBirths: new Set<string>(),
  emails: new Set<string>(),
  additionalAffiliations: new Set<string>(),
  dateOfJoins: new Set<string>(),
  beiChapters: new Set<string>(),
  secondaryPhoneNumbers: new Set<string>(),
  secondaryNames: new Set<string>(),
};

const patientSearchReducer = createSlice({
  name: 'patientSearch',
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
    setAdditionalAffiliations(state, action: PayloadAction<Set<string>>) {
      state.additionalAffiliations = action.payload;
    },
    setDateOfJoins(state, action: PayloadAction<Set<string>>) {
      state.dateOfJoins = action.payload;
    },
    setBeiChapters(state, action: PayloadAction<Set<string>>) {
      state.beiChapters = action.payload;
    },
    setSecondaryPhoneNumbers(state, action: PayloadAction<Set<string>>) {
      state.secondaryPhoneNumbers = action.payload;
    },
    setSecondaryNames(state, action: PayloadAction<Set<string>>) {
      state.secondaryNames = action.payload;
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
} = patientSearchReducer.actions;

export default patientSearchReducer.reducer;
