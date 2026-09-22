import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });
});

describe("JWT tokens", () => {
  const userId1 = "firstUserId";
  const userId2 = "secondUserId";
  const secret = "thisIsTheUniversalSecret";
  const expiresIn = 30 * 60;
  let jwt1: string;
  let jwt2: string;

  beforeAll(() => {
    jwt1 = makeJWT(userId1, expiresIn, secret);
    jwt2 = makeJWT(userId2, expiresIn, secret);
  });

  it("should return the userId: firstUserId, for the correct jwt token", () => {
    const result = validateJWT(jwt1, secret);
    expect(result).toBe(userId1);
  });

  it("should throw an error for the incorrect secret", () => {
    expect(() => validateJWT(jwt2, "wrongSecret")).toThrow();
  });
});