import { eq, gt, and, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens, NewRefreshToken } from "../schema.js";

export async function CreateRefreshToken(refreshToken: NewRefreshToken) {
    const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
    return result;
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const [result] = await db
    .select({ userId: refreshTokens.userId })
    .from(refreshTokens)
    .where(
        and(
            eq(refreshTokens.token, refreshToken),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, new Date())
        )
    )
    return result;
}

export async function revokeToken(refreshToken: string) {
    return await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(), updatedAt: new Date()})
    .where(eq(refreshTokens.token, refreshToken))
    .returning();
}