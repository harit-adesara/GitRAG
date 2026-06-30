import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <header className="border-b border-[#1e1e2a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path
                  d="M11 2L19 7V15L11 20L3 15V7L11 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="11" cy="11" r="3" fill="white" />
              </svg>
            </div>

            <span className="text-lg font-semibold">GitRAG</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-[#1e1e2a] text-[#c7c7d1] hover:bg-[#13131a] transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-sm">
              AI Powered Repository Assistant
            </span>

            <h1 className="mt-6 text-5xl lg:text-6xl font-bold leading-tight">
              Chat With Any
              <span className="text-violet-500"> GitHub Repository</span>
            </h1>

            <p className="mt-6 text-lg text-[#8b8b9b] leading-relaxed">
              GitRAG helps developers understand codebases faster by combining
              Retrieval-Augmented Generation (RAG) with AI. Ask questions,
              explore architecture, understand APIs, and onboard to projects in
              minutes.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-[#1e1e2a] hover:bg-[#13131a] transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-3xl p-6 shadow-xl">
            <div className="border border-[#1e1e2a] rounded-2xl overflow-hidden">
              <div className="bg-[#13131a] px-4 py-3 border-b border-[#1e1e2a]">
                <span className="text-sm text-[#8b8b9b]">
                  Repository Assistant
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="ml-auto max-w-[80%] bg-violet-600 text-white rounded-2xl px-4 py-3">
                  Explain authentication flow in this project.
                </div>

                <div className="max-w-[90%] bg-[#13131a] rounded-2xl px-4 py-3 text-[#c7c7d1]">
                  Authentication starts from the login controller, validates
                  credentials, generates JWT tokens, stores refresh tokens, and
                  protects routes through middleware...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Use GitRAG?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-3">
              Repository Understanding
            </h3>

            <p className="text-[#8b8b9b]">
              Quickly understand project structure, architecture, and business
              logic.
            </p>
          </div>

          <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-3">AI-Powered Answers</h3>

            <p className="text-[#8b8b9b]">
              Ask questions in natural language and get contextual answers from
              your repository.
            </p>
          </div>

          <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-3">Faster Onboarding</h3>

            <p className="text-[#8b8b9b]">
              Reduce time spent reading code and start contributing faster.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2a]">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-[#8b8b9b] text-sm">
          Built with React, Node.js, FastAPI, Qdrant and AI.
        </div>
      </footer>
    </div>
  );
}
