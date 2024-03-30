import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { studAPI } from "../services/StudService";
import UserReducer from "./reducers/UserSlice";

const rootReducer = combineReducers({
  [studAPI.reducerPath]: studAPI.reducer,
  UserReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(studAPI.middleware),
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
