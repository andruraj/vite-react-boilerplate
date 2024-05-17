import { createSlice } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
import { deleteAllCookies, setCookie } from "@/utils/cookies";

const initialState = {
  user: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;

      if (!!token) {
        deleteAllCookies();
        setCookie("token", token);

        state.user = true;
      }
    },
    logout: (state) => {
      deleteAllCookies();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCredentials, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const isLoggedIn = (state) => state.auth.user;

const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/Login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
