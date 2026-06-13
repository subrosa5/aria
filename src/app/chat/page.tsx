"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useChatStore } from "@/store/chat";
import { Send, Plus, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { chats, activeChatId, isStreaming, setChats, setActiveChat, addChat, addMessage, updateLastMessage, setStreaming, updateChatTitle, deleteChat } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    fetch("/api/chat").then(r => r.json()).then(d => {
      if (d.chats) setChats(d.chats.map((c: { id: string; title: string; messages: { id: string; role: string; content: string; createdAt: string }[] }) => ({
        id: c.id, title: c.title,
        messages: c.messages.map(m => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, createdAt: new Date(m.createdAt) })),
      })));
    });
  }, [setChats]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat?.messages]);

  const newChat = () => {
    addChat({ id: `temp-${Date.now()}`, title: "New Chat", messages: [] });
  };

  const removeChat = useCallback(async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
    if (!chatId.startsWith("temp-")) {
      await fetch("/api/chat", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chatId }) });
    }
  }, [deleteChat]);

  const send = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const content = input.trim();
    setInput("");

    const userMsg = { id: `u-${Date.now()}`, role: "user" as const, content, createdAt: new Date() };
    const assistantMsg = { id: `a-${Date.now()}`, role: "assistant" as const, content: "", createdAt: new Date() };

    let chatId = activeChatId?.startsWith("temp-") ? null : activeChatId;
    let tempChatId: string | null = null;

    if (!activeChatId) {
      tempChatId = `temp-${Date.now()}`;
      addChat({ id: tempChatId, title: content.slice(0, 30), messages: [userMsg, assistantMsg] });
    } else if (activeChatId.startsWith("temp-")) {
      tempChatId = activeChatId;
      addMessage(activeChatId, userMsg);
      addMessage(activeChatId, assistantMsg);
    } else {
      addMessage(activeChatId, userMsg);
      addMessage(activeChatId, assistantMsg);
    }

    const messages = [...(activeChat?.messages || []), userMsg].map(m => ({ role: m.role, content: m.content }));

    setStreaming(true);
    let currentContent = "";
    let realChatId = chatId;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, chatId }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            if (json.chatId && !realChatId) {
              realChatId = json.chatId;
              if (tempChatId) {
                setChats(useChatStore.getState().chats.map(c =>
                  c.id === tempChatId ? { ...c, id: json.chatId } : c
                ));
                setActiveChat(json.chatId);
              }
            }
            if (json.delta) { currentContent += json.delta; updateLastMessage(realChatId || tempChatId || activeChatId!, currentContent); }
            if (json.title && realChatId) updateChatTitle(realChatId, json.title);
          } catch {}
        }
      }
    } finally {
      setStreaming(false);
    }
  }, [input, isStreaming, activeChatId, activeChat, addChat, addMessage, updateLastMessage, setStreaming, setChats, setActiveChat, updateChatTitle]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 flex flex-1">
        {/* Chat list */}
        <div className="w-60 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
          <div className="p-4 border-b border-slate-100">
            <button onClick={newChat} className="w-full flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {chats.map(c => (
              <div key={c.id}
                className={cn("group w-full flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer",
                  c.id === activeChatId ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-600 hover:bg-slate-50")}
                onClick={() => setActiveChat(c.id)}>
                <span className="flex-1 truncate">{c.title}</span>
                <button
                  onClick={(e) => removeChat(e, c.id)}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col h-screen">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you?</h2>
                <p className="text-slate-500 text-sm max-w-xs">Ask me anything — I can write, code, analyze, and more.</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-sm">
                  {["Write a blog post", "Debug my code", "Explain a concept", "Draft an email"].map(s => (
                    <button key={s} onClick={() => setInput(s)}
                      className="bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-600 text-xs px-3 py-2 rounded-lg transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence initial={false}>
                {activeChat.messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3 max-w-3xl", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex-shrink-0 flex items-center justify-center mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={cn("px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-xl whitespace-pre-wrap",
                      msg.role === "user" ? "bg-violet-600 text-white rounded-br-sm" : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm")}>
                      {msg.content}
                      {msg.role === "assistant" && !msg.content && isStreaming && (
                        <span className="flex gap-1 mt-1">
                          {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="max-w-3xl mx-auto flex gap-3 items-end">
              <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Message Aria..." rows={1}
                className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none max-h-32 scrollbar-hide" />
              <button onClick={send} disabled={!input.trim() || isStreaming}
                className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center hover:bg-violet-700 transition-colors disabled:opacity-40 flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </div>
  );
}
