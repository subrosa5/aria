import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "./route";

const makeRequest = (body: object) =>
  new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

const validBody = { name: "Test User", email: "test@example.com", password: "secret123" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("returns 400 when name is too short", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "A" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is shorter than 6 characters", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "123" }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when email is already taken", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing",
      name: "Existing",
      email: "test@example.com",
      password: "hashed",
      plan: "FREE",
      avatar: null,
      createdAt: new Date(),
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toBe("Email already in use");
  });

  it("returns 200 and creates user on valid data", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "new-user",
      name: validBody.name,
      email: validBody.email,
      password: "hashed",
      plan: "FREE",
      avatar: null,
      createdAt: new Date(),
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.user.email).toBe(validBody.email);
    expect(json.user.id).toBe("new-user");
  });

  it("does not return the password hash in the response", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "new-user",
      name: validBody.name,
      email: validBody.email,
      password: "$2b$12$hashedvalue",
      plan: "FREE",
      avatar: null,
      createdAt: new Date(),
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();
    expect(json.user.password).toBeUndefined();
  });

  it("sets an httpOnly token cookie on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "new-user",
      name: validBody.name,
      email: validBody.email,
      password: "hashed",
      plan: "FREE",
      avatar: null,
      createdAt: new Date(),
    });

    const res = await POST(makeRequest(validBody));
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("token=");
    expect(setCookie).toContain("HttpOnly");
  });
});
