"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authReducer from "./reducers/authReducer";

const createNoopStorage = () => {
  return {
    getItem(_key: unknown) {
      return Promise.resolve(null);
    },
    setItem(_key: unknown, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem(_key: unknown) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
  }),
);

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
