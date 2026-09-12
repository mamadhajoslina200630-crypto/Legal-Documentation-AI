import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import AIWorkspacePage from "./features/ai-workspace/AIWorkspacePage";
import DocumentWorkspacePage from "./features/document-workspace/DocumentWorkspacePage";
import ComparePage from "./features/compare/ComparePage";
import DraftPage from "./features/draft-rewrite/DraftPage";
import IndianLegalPage from "./features/indian-legal/IndianLegalPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        index: true,
        element: <AIWorkspacePage />,
      },
      {
        path: "document",
        element: <DocumentWorkspacePage />,
      },
      {
        path: "compare",
        element: <ComparePage />,
      },
      {
        path: "draft",
        element: <DraftPage />,
      },
      {
        path: "indian-legal",
        element: <IndianLegalPage />,
      },
    ],
  },
  // Backward-compatible direct routes
  {
    path: "/workspace",
    element: <App />,
    children: [
      {
        index: true,
        element: <AIWorkspacePage />,
      },
    ],
  },
  {
    path: "/document",
    element: <App />,
    children: [
      {
        index: true,
        element: <DocumentWorkspacePage />,
      },
    ],
  },
  {
    path: "/compare",
    element: <App />,
    children: [
      {
        index: true,
        element: <ComparePage />,
      },
    ],
  },
  {
    path: "/draft",
    element: <App />,
    children: [
      {
        index: true,
        element: <DraftPage />,
      },
    ],
  },
  {
    path: "/indian-legal",
    element: <App />,
    children: [
      {
        index: true,
        element: <IndianLegalPage />,
      },
    ],
  },
]);

export default router;
