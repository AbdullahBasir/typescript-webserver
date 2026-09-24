import { asc, eq, and } from 'drizzle-orm';
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
    return result;
}

export async function getChirps() {
    const result = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt))
    return result;
}

export async function getChirpsById(authorId: string) {
    const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(asc(chirps.createdAt))
    return result;
}

export async function getSingleChirp(id: string) {
    const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id))
    return result;
}

export async function deleteSingleChirp(userId: string, id: string) {
    return await db
    .delete(chirps)
    .where(
        and(
            eq(chirps.userId, userId),
            eq(chirps.id, id),
        )
    )
};