// src/api/api.js
import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach Authorization header automatically if token present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // token may already include "Bearer " — backend expects "Bearer <token>" in Authorization header
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

export default api;
