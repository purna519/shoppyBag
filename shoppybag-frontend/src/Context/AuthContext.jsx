// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // can store minimal user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // optional: call backend /api/auth/validate or decode token to get email/role
      // We'll call validate endpoint if available:
      api
        .get("/auth/validate")
        .then((res) => {
          if (res?.data?.status === "success") {
            // If API returns subject email in data
            setUser({ email: res.data.data });
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userInfo) => {
    // token string expected
    localStorage.setItem(
      "token",
      token.startsWith("Bearer ") ? token : `Bearer ${token}`
    );
    setUser(userInfo || {}); // optionally pass email/role
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
