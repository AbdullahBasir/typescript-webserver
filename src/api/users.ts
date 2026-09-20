import { Request, Response } from 'express';
import { createUser } from '../db/queries/users.js';
import { RespondWithJSON } from './json.js';
import { BadRequest } from '../errors.js';

export const createUserHandler = async (req: Request, res: Response) => {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequest("Missing required fields");
    }
    const user = await createUser({ email: params.email });

    if (!user) {
        throw new Error("Could not create user");
    }
    RespondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}