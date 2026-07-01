import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axios";

export default function ChatList() {
  const navigate = useNavigate();
  const { repoId } = useParams();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchChats = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `https://gitrag-awh4.onrender.com/gitrag/get-chats?repoId=${repoId}`,
        {
          withCredentials: true,
        },
      );

      setChats(res.data?.data?.chats ?? []);
    } catch (err) {
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [repoId]);

  const handleCreateChat = async () => {
    try {
      setCreating(true);

      const res = await axiosInstance.post(
        `https://gitrag-awh4.onrender.com/gitrag/create-chat?repoId=${repoId}`,
        {},
        {
          withCredentials: true,
        },
      );

      const chat = res.data?.data?.chat;

      if (chat) {
        navigate(`/layout/chat-page/${chat._id}/${repoId}`);
      }
    } catch (err) {
      setError("Failed to create chat");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />

        <p className="text-[#8b8b9b] mt-4">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Chats</h1>

        <p className="text-[#8b8b9b] mt-2">
          Browse previous conversations or create a new one.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* New Chat */}
      <button
        onClick={handleCreateChat}
        disabled={creating}
        className="
          mb-6
          px-5
          py-3
          rounded-2xl
          bg-violet-600
          hover:bg-violet-500
          disabled:opacity-50
          disabled:cursor-not-allowed
          text-white
          font-medium
          transition-all
        "
      >
        {creating ? "Creating..." : "+ New Chat"}
      </button>

      {/* Empty State */}
      {chats.length === 0 ? (
        <div className="bg-[#0f0f17] border border-[#1e1e2a] rounded-2xl p-10 text-center">
          <p className="text-[#8b8b9b]">
            No chats yet. Create your first chat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() =>
                navigate(`/layout/chat-page/${chat._id}/${repoId}`)
              }
              className="
                cursor-pointer
                bg-[#0f0f17]
                border
                border-[#1e1e2a]
                rounded-2xl
                p-5
                hover:border-violet-500/30
                hover:bg-[#13131a]
                transition-all
                duration-200
              "
            >
              <h3 className="text-white font-semibold text-lg">{chat.title}</h3>

              <p className="text-[#8b8b9b] text-sm mt-2">
                {new Date(chat.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
