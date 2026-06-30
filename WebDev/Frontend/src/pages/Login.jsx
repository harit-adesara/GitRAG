import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import React from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");
  let [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and Password is required");
      return;
    }
    if (!email.includes("@")) {
      setError("⚠️ Enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const result = await axios.post(
        "http://localhost:3000/gitrag/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      setUser(result.data?.data?.user);
      setSuccess("Login successfully ✅");
      setError("");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/layout");
      }, 2000);
    } catch (error) {
      setError("Error while login. Try again");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 font-sans">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-75 h-75 rounded-full bg-indigo-900/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-[#6b6b7a] text-sm mt-1.5">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-8 shadow-2xl shadow-black/60">
          <div className="space-y-5">
            {/* Email */}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2 rounded-lg mt-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[#9191a1] text-xs font-medium mb-2 tracking-wide uppercase">
                Email
              </label>
              <div
                className={`relative rounded-xl transition-all duration-200 ${
                  focused === "email"
                    ? "shadow-[0_0_0_1.5px_rgba(139,92,246,0.7)]"
                    : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4a5a]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0d0d14] text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none placeholder-[#35353f] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#9191a1] text-xs font-medium tracking-wide uppercase">
                  Password
                </label>
                <Link
                  className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
                  to="/forget-password"
                >
                  Forgot password?
                </Link>
              </div>
              <div
                className={`relative rounded-xl transition-all duration-200 ${
                  focused === "password"
                    ? "shadow-[0_0_0_1.5px_rgba(139,92,246,0.7)]"
                    : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                }`}
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4a5a]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0d14] text-white text-sm pl-10 pr-11 py-3 rounded-xl outline-none placeholder-[#35353f] transition-colors"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4a5a] hover:text-[#9191a1] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden
                bg-linear-to-r from-violet-600 to-indigo-600 text-white
                hover:from-violet-500 hover:to-indigo-500
                active:scale-[0.98] shadow-lg shadow-violet-900/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-20"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-80"
                      fill="white"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#35353f] text-sm mt-6">
          Don't have an account?{" "}
          <Link
            className="text-violet-400 hover:text-violet-300 transition-colors"
            to="/register"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
