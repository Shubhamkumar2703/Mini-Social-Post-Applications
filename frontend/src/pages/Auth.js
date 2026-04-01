import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./auth.css";

const Auth = ({ setUser }) => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSignup ? "/auth/signup" : "/auth/login";
      const res = await API.post(url, form);

      if (!isSignup) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/feed");
      }

      alert("Success!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
};

return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p onClick={() => setIsSignup(!isSignup)} className="toggle-text">
          {isSignup
            ? "Already have an account? Login"
            : "New here? Create account"}
        </p>
      </div>
    </div>
  );
};

export default Auth;