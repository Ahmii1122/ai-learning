import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/useAuth";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();

  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToVottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToVottom();
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again",
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg: any, index: number) => {
    const isUser = msg.role === "user";
    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
            isUser
              ? "bg-slate-200 text-slate-600 font-semibold text-sm"
              : "bg-emerald-500 text-white"
          }`}
        >
          {isUser ? (
            user?.username?.charAt(0).toUpperCase() || "U"
          ) : (
            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`max-w-[80%] px-5 py-4 shadow-sm border ${
            isUser
              ? "bg-emerald-500 border-emerald-400 text-white rounded-2xl rounded-tr-none"
              : "bg-white border-slate-200 text-slate-800 rounded-2xl rounded-tl-none"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="text-sm leading-relaxed">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50 ">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <MessageSquare className="text-emerald-600 w-7 h-7" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-slate-500 font-medium mt-3 text-sm">
          Loading Chat History...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-6 bg-linear-to-br from-slate-50/50 via-white/50 to-slate-100/50">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
              <MessageSquare
                className="text-emerald-600 w-8 h-8"
                strokeWidth={2}
              />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              Start a conversation
            </h3>
            <p className="text-slate-500 font-medium mt-3 text-sm">
              Ask questions about the document
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />
        {loading && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center shrink-0">
              <Sparkles className="text-white w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60">
              <div className="flex  gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* input area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
              placeholder="Ask a question about the document..."
            />
          </div>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="text-white w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
