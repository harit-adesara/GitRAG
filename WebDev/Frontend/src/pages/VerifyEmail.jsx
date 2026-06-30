import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;
      try {
        await axios.get(
          `http://localhost:3000/gitrag/verify/${verificationToken}`,
        );
        setStatus("success");
      } catch {
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [verificationToken]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(
        () => navigate("/login", { replace: true }),
        1500,
      );
      return () => clearTimeout(timer);
    }
    if (status === "failed") {
      const timer = setTimeout(
        () => navigate("/resend-verification", { replace: true }),
        2000,
      );
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-900/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-10 shadow-2xl shadow-black/60 text-center">
          {/* LOADING */}
          {status === "loading" && (
            <>
              <div className="mx-auto mb-6 w-14 h-14 rounded-full border-[3px] border-[#1e1e2a] border-t-violet-500 animate-spin" />
              <h2 className="text-white text-xl font-semibold tracking-tight">
                Verifying your email
              </h2>
              <p className="text-[#6b6b7a] text-sm mt-2">
                Please wait while we confirm your account
              </p>
            </>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <>
              <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-white text-xl font-semibold tracking-tight">
                Email verified
              </h2>
              <p className="text-[#6b6b7a] text-sm mt-2">
                Redirecting you to sign in…
              </p>
            </>
          )}

          {/* FAILED */}
          {status === "failed" && (
            <>
              <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h2 className="text-white text-xl font-semibold tracking-tight">
                Verification failed
              </h2>
              <p className="text-[#6b6b7a] text-sm mt-2">
                Redirecting to resend verification…
              </p>
              <button
                onClick={() => navigate("/register")}
                className="mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                  hover:from-violet-500 hover:to-indigo-500
                  active:scale-[0.98] shadow-lg shadow-violet-900/40"
              >
                Go to register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
