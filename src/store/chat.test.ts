import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore, type Message } from "./chat";

const makeMsg = (id: string, role: "user" | "assistant", content: string): Message => ({
  id,
  role,
  content,
  createdAt: new Date(),
});

beforeEach(() => {
  useChatStore.setState({ chats: [], activeChatId: null, isStreaming: false });
});

describe("addChat", () => {
  it("adds a chat and sets it as active", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Hello", messages: [] });

    expect(useChatStore.getState().chats).toHaveLength(1);
    expect(useChatStore.getState().activeChatId).toBe("c1");
  });

  it("prepends new chats so the latest appears first", () => {
    useChatStore.getState().addChat({ id: "c1", title: "First", messages: [] });
    useChatStore.getState().addChat({ id: "c2", title: "Second", messages: [] });

    expect(useChatStore.getState().chats[0].id).toBe("c2");
  });
});

describe("addMessage", () => {
  it("appends a message to the correct chat", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat", messages: [] });
    useChatStore.getState().addMessage("c1", makeMsg("m1", "user", "Hello"));

    const chat = useChatStore.getState().chats.find((c) => c.id === "c1");
    expect(chat?.messages).toHaveLength(1);
    expect(chat?.messages[0].content).toBe("Hello");
  });

  it("does not affect other chats", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat 1", messages: [] });
    useChatStore.getState().addChat({ id: "c2", title: "Chat 2", messages: [] });
    useChatStore.getState().addMessage("c1", makeMsg("m1", "user", "Hello"));

    const chat2 = useChatStore.getState().chats.find((c) => c.id === "c2");
    expect(chat2?.messages).toHaveLength(0);
  });
});

describe("updateLastMessage", () => {
  it("replaces the content of the last message (streaming token accumulation)", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat", messages: [] });
    useChatStore.getState().addMessage("c1", makeMsg("m1", "assistant", "Hello"));
    useChatStore.getState().updateLastMessage("c1", "Hello, world!");

    const chat = useChatStore.getState().chats.find((c) => c.id === "c1");
    expect(chat?.messages[0].content).toBe("Hello, world!");
  });

  it("only updates the last message, not earlier ones", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat", messages: [] });
    useChatStore.getState().addMessage("c1", makeMsg("m1", "user", "First"));
    useChatStore.getState().addMessage("c1", makeMsg("m2", "assistant", "Second"));
    useChatStore.getState().updateLastMessage("c1", "Updated second");

    const chat = useChatStore.getState().chats.find((c) => c.id === "c1");
    expect(chat?.messages[0].content).toBe("First");
    expect(chat?.messages[1].content).toBe("Updated second");
  });
});

describe("deleteChat", () => {
  it("removes the chat from the list", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat", messages: [] });
    useChatStore.getState().deleteChat("c1");

    expect(useChatStore.getState().chats).toHaveLength(0);
  });

  it("sets the next chat as active when the active one is deleted", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Older", messages: [] });
    useChatStore.getState().addChat({ id: "c2", title: "Newer", messages: [] });
    // c2 is now active (last added)
    useChatStore.getState().deleteChat("c2");

    expect(useChatStore.getState().activeChatId).toBe("c1");
  });

  it("sets activeChatId to null when the last chat is deleted", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Only", messages: [] });
    useChatStore.getState().deleteChat("c1");

    expect(useChatStore.getState().activeChatId).toBeNull();
  });

  it("keeps activeChatId unchanged when a non-active chat is deleted", () => {
    useChatStore.getState().addChat({ id: "c1", title: "Chat 1", messages: [] });
    useChatStore.getState().addChat({ id: "c2", title: "Chat 2", messages: [] });
    // c2 is active
    useChatStore.getState().deleteChat("c1");

    expect(useChatStore.getState().activeChatId).toBe("c2");
  });
});

describe("setStreaming", () => {
  it("toggles streaming state", () => {
    useChatStore.getState().setStreaming(true);
    expect(useChatStore.getState().isStreaming).toBe(true);

    useChatStore.getState().setStreaming(false);
    expect(useChatStore.getState().isStreaming).toBe(false);
  });
});

describe("updateChatTitle", () => {
  it("updates the title of the specified chat", () => {
    useChatStore.getState().addChat({ id: "c1", title: "New Chat", messages: [] });
    useChatStore.getState().updateChatTitle("c1", "My first conversation");

    const chat = useChatStore.getState().chats.find((c) => c.id === "c1");
    expect(chat?.title).toBe("My first conversation");
  });
});
