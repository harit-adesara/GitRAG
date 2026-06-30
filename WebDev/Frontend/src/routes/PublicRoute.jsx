import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 2L19 7V15L11 20L3 15V7L11 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="11" cy="11" r="3" fill="white" />
              </svg>
            </div>

            <h1 className="text-white text-xl font-semibold">GitRAG</h1>
          </div>

          {/* Loader Card */}
          <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl p-8 w-[320px] flex flex-col items-center">
            {/* Spinner */}
            <div className="relative mb-5">
              <div className="w-14 h-14 rounded-full border-4 border-[#252535]" />

              <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
            </div>

            {/* Title */}
            <h2 className="text-white font-semibold text-lg">
              Verifying Session
            </h2>

            {/* Subtitle */}
            <p className="text-[#8b8b9b] text-sm mt-2 text-center">
              Checking your authentication status.
            </p>

            {/* Animated dots */}
            <div className="flex gap-2 mt-5">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />

              <span
                className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />

              <span
                className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/layout" replace /> : <Outlet />;
};

export default PublicRoute;
