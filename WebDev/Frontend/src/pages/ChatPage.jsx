import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MessageContent from "./MessageContent.jsx";
import axiosInstance from "../axios.js";

export default function ChatPage() {
  const { chatId } = useParams();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [repoId, setRepoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const fetchMessages = async () => {
    try {
      setInitialLoading(true);

      const res = await axiosInstance.get(
        `https://gitrag-awh4.onrender.com/gitrag/chat-data?chatId=${chatId}`,
        {
          withCredentials: true,
        },
      );

      setMessages(res.data?.data?.messages ?? []);

      if (res.data?.data?.messages?.length > 0) {
        const firstMessage = res.data.data.messages[0];

        if (firstMessage.repoId) {
          setRepoId(firstMessage.repoId);
        }
      }
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      _id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(
        "https://gitrag-awh4.onrender.com/gitrag/send-msg",
        {
          chatId,
          repoId,
          content: currentMessage,
        },
        {
          withCredentials: true,
        },
      );

      const aiMessage = {
        _id: Date.now() + 1,
        role: "ai",
        content: res.data?.data?.response ?? "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now() + 2,
          role: "ai",
          content: "Something went wrong while generating a response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />

        <p className="text-[#8b8b9b] mt-4">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-[#1e1e2a] px-4 sm:px-6 py-4">
        <h1 className="text-white text-xl font-semibold">Repository Chat</h1>

        <p className="text-[#8b8b9b] text-sm mt-1">
          Ask questions about your repository.
        </p>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="text-center">
                <h2 className="text-white text-2xl font-semibold">
                  Start a conversation
                </h2>

                <p className="text-[#8b8b9b] mt-3">
                  Ask anything about your repository.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-[#13131a] border border-[#1e1e2a] text-white"
                    }`}
                  >
                    <MessageContent content={msg.content} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#13131a] border border-[#1e1e2a] rounded-2xl px-4 py-3">
                    <div className="flex gap-1 text-violet-400">
                      <span className="animate-bounce">●</span>

                      <span
                        className="animate-bounce"
                        style={{
                          animationDelay: "0.2s",
                        }}
                      >
                        ●
                      </span>

                      <span
                        className="animate-bounce"
                        style={{
                          animationDelay: "0.4s",
                        }}
                      >
                        ●
                      </span>
                    </div>

                    <p className="text-[#8b8b9b] text-sm mt-2">Thinking...</p>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#1e1e2a] p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about this repository..."
            className="
              flex-1
              resize-none
              rounded-2xl
              bg-[#13131a]
              border
              border-[#1e1e2a]
              px-4
              py-3
              text-white
              placeholder:text-[#4a4a5a]
              outline-none
              focus:border-violet-500
            "
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="
              px-5
              rounded-2xl
              bg-violet-600
              hover:bg-violet-500
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              font-medium
              transition
            "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
