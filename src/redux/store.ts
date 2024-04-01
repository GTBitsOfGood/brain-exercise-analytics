import { Dispatch, PayloadAction, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import rootReducer from "./rootReducer";

const setToArray =
  () => (next: Dispatch) => (action: PayloadAction<unknown>) => {
    if (action.payload instanceof Set) {
      return next({ ...action, payload: Array.from(action.payload) });
    }
    return next(action);
  };

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(setToArray),
});

export const persistor = persistStore(store);
