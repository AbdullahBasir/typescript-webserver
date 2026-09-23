import { db } from "../index.js";
import { eq } from 'drizzle-orm';
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
 const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
    return await db.delete(users);
}

export async function userLogin(email: string) {
  const [result] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  return result;
}

export async function updateUser(email: string, password: string, userId: string) {
  const [result] = await db
  .update(users)
  .set({email: email, hashedPassword: password})
  .where(eq(users.id, userId))
  .returning();
  return result;
}

export async function upgradeUserToRed(redUserId: string) {
  const [result] = await db
  .update(users)
  .set({isChirpyRed: true})
  .where(eq(users.id, redUserId))
  .returning();
  return result;
}