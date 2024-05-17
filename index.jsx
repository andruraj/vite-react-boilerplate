import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { localRouter } from "@/router";
import "@/globals.css";
import ErrorBoundary from "@/ErrorBoundary";

createRoot(document.getElementById("app")).render(
  <ErrorBoundary>
    <RouterProvider router={localRouter} />
  </ErrorBoundary>
);
