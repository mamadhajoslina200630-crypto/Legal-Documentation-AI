import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: "mock-user-1", email: "demo@legalai.in", full_name: "Legal User" });
  const [activeWorkspace, setActiveWorkspace] = useState({ id: "ws-default", name: "Default Legal Workspace" });
  const [token, setToken] = useState(localStorage.getItem("legal_ai_token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("legal_ai_token", token);
    } else {
      localStorage.removeItem("legal_ai_token");
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.access_token) {
        setToken(res.access_token);
        setUser(res.user);
      }
      return res;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("legal_ai_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeWorkspace,
        setActiveWorkspace,
        token,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
