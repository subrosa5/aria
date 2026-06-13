"use client";
import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  isStreaming: boolean;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (id: string) => void;
  addChat: (chat: Chat) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateLastMessage: (chatId: string, content: string) => void;
  setStreaming: (v: boolean) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChatId: null,
  isStreaming: false,
  setChats: (chats) => set({ chats }),
  setActiveChat: (id) => set({ activeChatId: id }),
  addChat: (chat) => set((s) => ({ chats: [chat, ...s.chats], activeChatId: chat.id })),
  addMessage: (chatId, message) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, message] } : c
      ),
    })),
  updateLastMessage: (chatId, content) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: c.messages.map((m, i) =>
                i === c.messages.length - 1 ? { ...m, content } : m
              ),
            }
          : c
      ),
    })),
  setStreaming: (v) => set({ isStreaming: v }),
  updateChatTitle: (chatId, title) =>
    set((s) => ({
      chats: s.chats.map((c) => (c.id === chatId ? { ...c, title } : c)),
    })),
  deleteChat: (chatId) =>
    set((s) => {
      const chats = s.chats.filter((c) => c.id !== chatId);
      const activeChatId = s.activeChatId === chatId ? (chats[0]?.id ?? null) : s.activeChatId;
      return { chats, activeChatId };
    }),
}));
