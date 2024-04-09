/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGeneralReducer, RecursivePartial } from "@/common_utils/types";

const initialState: IGeneralReducer = {
  pendingApprovals: 0,
};

// Helper function to copy all properties from newState over to the existing state
const setState = (
  state: IGeneralReducer,
  newState: RecursivePartial<IGeneralReducer>,
): IGeneralReducer => {
  state.pendingApprovals = newState.pendingApprovals ?? state.pendingApprovals;
  return state;
};

const generalReducer = createSlice({
  name: "generalInfo",
  initialState,
  reducers: {
    update(state, action: PayloadAction<Partial<IGeneralReducer>>) {
      setState(state, action.payload);
    },
  },
});

export const { update } = generalReducer.actions;

export default generalReducer.reducer;
