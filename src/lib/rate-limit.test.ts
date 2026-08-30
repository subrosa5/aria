import { describe, it, expect, vi } from "vitest";

vi.mock("./prisma", () => ({
  prisma: {
    usage: {
      count: vi.fn(),
    },
  },
}));

import { prisma } from "./prisma";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows the request when under the limit", async () => {
    vi.mocked(prisma.usage.count).mockResolvedValue(5);
    const result = await checkRateLimit("user-1");
    expect(result.allowed).toBe(true);
  });

  it("blocks the request when at or over the limit", async () => {
    vi.mocked(prisma.usage.count).mockResolvedValue(20);
    const result = await checkRateLimit("user-1");
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("scopes the count to the requesting user", async () => {
    vi.mocked(prisma.usage.count).mockResolvedValue(0);
    await checkRateLimit("user-42");
    expect(prisma.usage.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: "user-42" }) })
    );
  });
});
