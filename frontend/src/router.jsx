import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AIWorkspacePage from "./features/ai-workspace/AIWorkspacePage";
import DocumentWorkspacePage from "./features/document-workspace/DocumentWorkspacePage";
import ComparePage from "./features/compare/ComparePage";
import DraftPage from "./features/draft-rewrite/DraftPage";
import IndianLegalPage from "./features/indian-legal/IndianLegalPage";

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
]);

export default router;
