/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChapterSearchReducer, RecursivePartial } from "@/common_utils/types";

const initialState: IChapterSearchReducer = {
  name: "",
};

// Helper function to copy all properties from newState over to the existing state
const setState = (
  state: IChapterSearchReducer,
  newState: RecursivePartial<IChapterSearchReducer>,
): IChapterSearchReducer => {
  state.name = newState.name ?? state.name;
  return state;
};

const chapterSearchReducer = createSlice({
  name: "chapterSearch",
  initialState,
  reducers: {
    update(
      state,
      action: PayloadAction<RecursivePartial<IChapterSearchReducer>>,
    ) {
      setState(state, action.payload);
    },
    clear(state) {
      setState(state, initialState);
    },
  },
});

export const { update, clear } = chapterSearchReducer.actions;

export default chapterSearchReducer.reducer;
