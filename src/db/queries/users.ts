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