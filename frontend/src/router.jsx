import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AIWorkspacePage from "./features/ai-workspace/AIWorkspacePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AIWorkspacePage />,
      },
      {
        path: "*",
        element: <AIWorkspacePage />,
      }
    ],
  },
]);

export default router;
