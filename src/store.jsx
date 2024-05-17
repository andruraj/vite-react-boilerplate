import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { api } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: true,
});
