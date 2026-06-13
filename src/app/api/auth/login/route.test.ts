import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "./route";

const mockUser = async (password: string) => ({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  password: await bcrypt.hash(password, 12),
  plan: "FREE",
  avatar: null,
  createdAt: new Date(),
});

const makeRequest = (body: object) =>
  new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/login", () => {
  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ email: "", password: "secret" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 when password is missing", async () => {
    const res = await POST(makeRequest({ email: "test@example.com", password: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when email format is invalid", async () => {
    const res = await POST(makeRequest({ email: "not-an-email", password: "secret" }));
    expect(res.status).toBe(400);
  });

  it("returns 401 when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    const res = await POST(makeRequest({ email: "ghost@example.com", password: "secret" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Invalid credentials");
  });

  it("returns 401 when password is wrong", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(await mockUser("correctPassword"));
    const res = await POST(makeRequest({ email: "test@example.com", password: "wrongPassword" }));
    expect(res.status).toBe(401);
  });

  it("returns 200 and user data on valid credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(await mockUser("secret123"));
    const res = await POST(makeRequest({ email: "test@example.com", password: "secret123" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.user.email).toBe("test@example.com");
    expect(json.user.id).toBe("user-1");
  });

  it("sets an httpOnly token cookie on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(await mockUser("secret123"));
    const res = await POST(makeRequest({ email: "test@example.com", password: "secret123" }));
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("token=");
    expect(setCookie).toContain("HttpOnly");
  });
});
