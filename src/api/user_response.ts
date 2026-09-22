import { NewUser } from '../db/schema.js'

export type userResponse = Omit<NewUser, "hashedPassword">;