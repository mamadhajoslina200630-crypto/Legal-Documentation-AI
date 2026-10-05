import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("legal_ai_token") || sessionStorage.getItem("legal_ai_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("legal_ai_user") || sessionStorage.getItem("legal_ai_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse errors
      }
    }
    const existingToken = localStorage.getItem("legal_ai_token") || sessionStorage.getItem("legal_ai_token");
    if (existingToken) {
      return { id: "auth-user-id", email: "demo@legalai.in", full_name: "Legal Practitioner" };
    }
    return null;
  });
  const [activeWorkspace, setActiveWorkspace] = useState({ id: "ws-default", name: "Default Legal Workspace" });

  useEffect(() => {
    if (token) {
      localStorage.setItem("legal_ai_token", token);
    } else {
      localStorage.removeItem("legal_ai_token");
      sessionStorage.removeItem("legal_ai_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("legal_ai_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("legal_ai_user");
      sessionStorage.removeItem("legal_ai_user");
    }
  }, [user]);

  const login = async (email, password, remember = true) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res && res.access_token) {
        const authUser = res.user || { id: "auth-user-id", email, full_name: "Legal Practitioner" };
        setToken(res.access_token);
        setUser(authUser);
        if (remember) {
          localStorage.setItem("legal_ai_token", res.access_token);
          localStorage.setItem("legal_ai_user", JSON.stringify(authUser));
        } else {
          sessionStorage.setItem("legal_ai_token", res.access_token);
          sessionStorage.setItem("legal_ai_user", JSON.stringify(authUser));
        }
        return res;
      }
      throw new Error("Invalid response from authentication server");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const signup = async (email, password, fullName = "") => {
    try {
      const res = await api.post("/auth/signup", { email, password, full_name: fullName });
      return res;
    } catch (err) {
      console.error("Signup failed", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("legal_ai_token");
    localStorage.removeItem("legal_ai_user");
    sessionStorage.removeItem("legal_ai_token");
    sessionStorage.removeItem("legal_ai_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeWorkspace,
        setActiveWorkspace,
        token,
        login,
        signup,
        logout,
        isAuthenticated: Boolean(token && user),
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
