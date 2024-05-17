import { getCookie } from "@/utils/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getCookie("token");
      if (!!token) {
        headers.set("authorization", `Bearer ${token}`);
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
