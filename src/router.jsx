import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import App from "@/App";

const ErrorPage = lazy(() =>
  import("@/ErrorPage").then(({ ErrorPage }) => ({ default: ErrorPage }))
);

export const localRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <App />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [],
  },
]);
