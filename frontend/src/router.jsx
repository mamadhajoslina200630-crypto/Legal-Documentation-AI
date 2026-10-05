import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import App from "./App";
import AIWorkspacePage from "./features/ai-workspace/AIWorkspacePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthContext } from "./context/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AIWorkspacePage />,
      },
      {
        path: "*",
        element: <AIWorkspacePage />,
      },
    ],
  },
]);

export default router;
