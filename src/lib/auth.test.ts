import { describe, it, expect } from "vitest";
import { signToken, verifyToken, hashPassword, comparePassword } from "./auth";

describe("signToken / verifyToken", () => {
  const payload = { id: "user-1", email: "test@example.com", name: "Test User", plan: "FREE" };

  it("signs a token and verifies it back with correct payload", () => {
    const token = signToken(payload);
    const result = verifyToken(token);

    expect(result?.id).toBe(payload.id);
    expect(result?.email).toBe(payload.email);
    expect(result?.name).toBe(payload.name);
    expect(result?.plan).toBe(payload.plan);
  });

  it("returns null for a tampered token", () => {
    const token = signToken(payload);
    const tampered = token.slice(0, -5) + "xxxxx";
    expect(verifyToken(tampered)).toBeNull();
  });

  it("returns null for a completely invalid token", () => {
    expect(verifyToken("not.a.token")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(verifyToken("")).toBeNull();
  });
});

describe("hashPassword / comparePassword", () => {
  it("produces a hash that is not equal to the original password", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).not.toBe("secret123");
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("verifies correct password against hash", async () => {
    const hash = await hashPassword("myPassword!");
    expect(await comparePassword("myPassword!", hash)).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("myPassword!");
    expect(await comparePassword("wrongPassword", hash)).toBe(false);
  });

  it("produces different hashes for the same input (salt)", async () => {
    const hash1 = await hashPassword("samePassword");
    const hash2 = await hashPassword("samePassword");
    expect(hash1).not.toBe(hash2);
  });
});
