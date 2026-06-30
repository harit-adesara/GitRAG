import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ResendEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focused, setFocused] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/gitrag/resend-register-email",
        { email },
        { withCredentials: true },
      );

      setSuccess("Verification email sent successfully!");
      setEmail("");
    } catch (err) {
      setError("Failed to resend email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-900/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Resend verification
          </h1>
          <p className="text-[#6b6b7a] text-sm mt-1.5">
            Enter your email to receive a new link
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-8 shadow-2xl shadow-black/60">
          <div className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-[#9191a1] text-xs font-medium mb-2 tracking-wide uppercase">
                  Email
                </label>
                <div
                  className={`relative rounded-xl transition-all duration-200 ${
                    focused
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full bg-[#0d0d14] text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none placeholder-[#35353f] transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden
                  bg-gradient-to-r from-violet-600 to-indigo-600 text-white
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
                    Sending…
                  </span>
                ) : (
                  "Resend email"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex justify-between mt-6 px-1">
          <Link
            to="/login"
            className="text-[#35353f] text-sm hover:text-violet-400 transition-colors"
          >
            ← Back to sign in
          </Link>
          <Link
            to="/register"
            className="text-[#35353f] text-sm hover:text-violet-400 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
