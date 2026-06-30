import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

const ConfirmRecloneModal = ({ repoName, onConfirm, onCancel }) => (
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
          background: "rgba(234,179,8,0.1)",
          border: "1px solid rgba(234,179,8,0.2)",
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
          stroke="#fbbf24"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
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
        Reclone "{repoName}"?
      </h2>
      <p
        style={{
          color: "#8b8b9b",
          fontSize: "14px",
          lineHeight: 1.6,
          margin: "0 0 1.5rem",
        }}
      >
        This will re-fetch and re-index the repository from scratch. It can take
        up to <span style={{ color: "#fcd34d" }}>2 minutes</span>. The existing
        index will be replaced.
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
            background: "#b45309",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Yes, reclone it
        </button>
      </div>
    </div>
  </div>
);

const RepoCard = ({ repo, onReclone, recloning, deleting }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-5 flex flex-col gap-4">
      {/* Top */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {repo.name}
          </p>
          <p className="text-[#6a6a78] text-xs truncate mt-0.5">{repo.url}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="text-[11px] text-[#4a4a5a]">
        Added{" "}
        {new Date(repo.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => navigate(`/layout/chat/${repo._id}`)}
          disabled={recloning}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat
        </button>

        <button
          onClick={() => onReclone(repo)}
          disabled={recloning}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#13131a] border border-[#1e1e2a] text-[#9191a1] hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {recloning ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            </svg>
          )}
          {recloning ? "Recloning…" : "Reclone"}
        </button>

        <button
          onClick={() => handleDelete(repo._id)}
          disabled={deleting}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const MyRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmRepo, setConfirmRepo] = useState(null);
  const [recloningId, setRecloningId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (repoId) => {
    try {
      setDeletingId(repoId);

      await axiosInstance.delete(
        `https://gitrag-awh4.onrender.com/gitrag/delete-repo?repoId=${repoId}`,
        {
          withCredentials: true,
        },
      );

      setRepos((prev) => prev.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axiosInstance.get(
          "https://gitrag-awh4.onrender.com/gitrag/get-repos",
          {
            withCredentials: true,
          },
        );

        console.log(res.data.data.repos.length);
        setRepos(res.data?.data?.repos ?? []);
      } catch {
        setError("Failed to load repositories.");
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const handleReclone = async () => {
    const repo = confirmRepo;
    setConfirmRepo(null);
    setRecloningId(repo._id);

    try {
      await axiosInstance.post(
        `https://gitrag-awh4.onrender.com/gitrag/pull-repo?repoId=${repo._id}`,
        {},
        { withCredentials: true },
      );
    } catch {
      // optionally show a per-card error
    } finally {
      setRecloningId(null);
    }
  };

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {confirmRepo && (
        <ConfirmRecloneModal
          repoName={confirmRepo.name}
          onConfirm={handleReclone}
          onCancel={() => setConfirmRepo(null)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My repositories</h1>
          <p className="text-[#8b8b9b] text-sm mt-1">
            All your indexed repositories, ready to chat.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-[#6a6a78] text-sm py-12 justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Loading repositories…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-20 bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">
              No repositories yet
            </p>
            <p className="text-[#6a6a78] text-sm mt-1">
              Import your first repository to start chatting with it.
            </p>
          </div>
        )}

        {!loading && repos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                onReclone={(r) => setConfirmRepo(r)}
                recloning={recloningId === repo._id}
                deleting={deletingId === repo._id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyRepos;
