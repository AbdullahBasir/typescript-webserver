import { Request, Response } from 'express';
import { createUser, userLogin } from '../db/queries/users.js';
import { RespondWithJSON } from './json.js';
import { BadRequest, NotFound, Unauthorized } from '../errors.js';
import { hashPassword, checkPasswordHash } from '../auth.js';
import { userResponse } from './user_response.js';

export const createUserHandler = async (req: Request, res: Response) => {
    type parameters = {
        email: string;
        password: string;
    };

    const params: parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequest("Missing required fields");
    }

    const hashed = await hashPassword(params.password);

    const user = await createUser({ email: params.email, hashedPassword: hashed });

    if (!user) {
        throw new Error("Could not create user");
    }

    const ommitted: userResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    RespondWithJSON(res, 201, ommitted);
}

export const userLoginHandler = async (req: Request, res: Response) => {
    type paramters = {
        email: string;
        password: string;
    }

    const params: paramters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequest("Missing required fields");
    }

    const user = await userLogin(params.email);
    if (!user) {
        throw new Unauthorized("Could not find user");
    }

    const isValidPassword = await checkPasswordHash(params.password, user.hashedPassword);
    if (!isValidPassword) {
        throw new Unauthorized("incorrect email or password");
    }

    const ommitted: userResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    RespondWithJSON(res, 200, ommitted);
}