import { useState } from "react";
import axiosInstance from "../axios";

const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}
  >
    <div
      style={{
        background: "#0f0f17",
        border: "1px solid #1e1e2a",
        borderRadius: "16px",
        padding: "1.5rem",
        maxWidth: "420px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      <h2
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: 600,
          margin: "0 0 0.5rem",
        }}
      >
        Clone this repository?
      </h2>
      <p
        style={{
          color: "#8b8b9b",
          fontSize: "14px",
          lineHeight: 1.6,
          margin: "0 0 1.5rem",
        }}
      >
        This will clone and index the repository into GitRag. It can take time
        depending on the repo size. Please don't close this tab.
      </p>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "0.625rem",
            background: "#13131a",
            border: "1px solid #1e1e2a",
            borderRadius: "10px",
            color: "#9191a1",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "0.625rem",
            background: "#7c3aed",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Yes, clone it
        </button>
      </div>
    </div>
  </div>
);

const CreateRepo = () => {
  const [cloneUrl, setCloneUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cloneUrl.trim() || !alias.trim()) return;
    setError("");
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axiosInstance.post(
        "https://gitrag-awh4.onrender.com/gitrag/create-repo",
        { url: cloneUrl, name: alias },
        { withCredentials: true },
      );
      setSuccess(true);
      setCloneUrl("");
      setAlias("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Blocking overlay during load */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p style={{ color: "#c4b5fd", fontSize: "14px", fontWeight: 500 }}>
            Cloning repository…
          </p>
          <p style={{ color: "#6a6a78", fontSize: "13px" }}>
            This may take time depending on the repository size. Please don't
            close this tab.
          </p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-xl mx-auto">
        <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white">Add repository</h1>
          <p className="text-[#8b8b9b] text-sm mt-2">
            Import a GitHub repository and give it an alias for chatting.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm text-white mb-2">
                Repository clone URL
              </label>
              <input
                type="text"
                value={cloneUrl}
                onChange={(e) => setCloneUrl(e.target.value)}
                placeholder="https://github.com/user/repo.git"
                disabled={loading}
                className="w-full bg-[#13131a] border border-[#1e1e2a] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-white mb-2">
                Alias name
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-auth-service"
                disabled={loading}
                className="w-full bg-[#13131a] border border-[#1e1e2a] rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-[#6a6a78] mt-2">
                This name will be used when chatting with the repository.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Repository imported successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !cloneUrl.trim() || !alias.trim()}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import repository
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
