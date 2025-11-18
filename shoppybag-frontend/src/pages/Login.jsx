import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      // backend ApiResponse -> res.data.data is token (adjust if different)
      const token = res.data.data;
      if (!token) {
        setErr(res.data.message || "Login error");
        return;
      }
      login(token, { email });
      localStorage.setItem("userEmail", email);
      nav("/");
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card p-4" style={{ width: 380 }}>
        <h4 className="mb-3">Signin</h4>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Sign in</button>
        </form>
      </div>
    </div>
  );
}
