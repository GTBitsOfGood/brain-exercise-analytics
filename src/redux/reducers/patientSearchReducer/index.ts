import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientSearchParams } from '@/common_utils/types';

const initialState: PatientSearchParams = {
  name: '',
  active: undefined,
  countries: [],
  states: [],
  cities: [],
  dateOfBirths: [],
  emails: [],
  additionalAffiliations: [],
  dateOfJoins: [],
  beiChapters: [],
  secondaryPhones: [],
  secondaryNames: [],
};

const patientSearchReducer = createSlice({
  name: 'patientSearch',
  initialState,
  reducers: {
    setFullName(state, action: PayloadAction<string | undefined>) {
      state.name = action.payload;
    },
    setActive(state, action: PayloadAction<boolean | undefined>) {
      state.active = action.payload;
    },
    setCountries(state, action: PayloadAction<string[]>) {
      state.countries = action.payload;
    },
    setStates(state, action: PayloadAction<string[]>) {
      state.states = action.payload;
    },
    setCities(state, action: PayloadAction<string[]>) {
      state.cities = action.payload;
    },
    setDateOfBirths(state, action: PayloadAction<string[]>) {
      state.dateOfBirths = action.payload;
    },
    setEmails(state, action: PayloadAction<string[]>) {
      state.emails = action.payload;
    },
    setAdditionalAffiliations(state, action: PayloadAction<string[]>) {
      state.additionalAffiliations = action.payload;
    },
    setDateOfJoins(state, action: PayloadAction<string[]>) {
      state.dateOfJoins = action.payload;
    },
    setBeiChapters(state, action: PayloadAction<string[]>) {
      state.beiChapters = action.payload;
    },
    setSecondaryPhoneNumbers(state, action: PayloadAction<string[]>) {
      state.secondaryPhones = action.payload;
    },
    setSecondaryNames(state, action: PayloadAction<string[]>) {
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
