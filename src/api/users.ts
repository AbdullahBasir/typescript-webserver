import { Request, Response } from 'express';
import { createUser, userLogin } from '../db/queries/users.js';
import { RespondWithJSON } from './json.js';
import { BadRequest, Unauthorized } from '../errors.js';
import { hashPassword, checkPasswordHash, getBearerToken, makeJWT } from '../auth/auth.js';
import { userResponse } from './user_response.js';
import { config } from '../config.js'

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

type LoginResponse = userResponse & {
  token: string;
};

export const userLoginHandler = async (req: Request, res: Response) => {
    type paramters = {
        email: string;
        password: string;
        expiresInSeconds?: number;
    }

    const params: paramters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequest("Missing required fields");
    }

    if (typeof params.expiresInSeconds === "undefined" || (typeof params.expiresInSeconds === "number") && params.expiresInSeconds > config.jwt.defaultDuration) {
        params.expiresInSeconds = config.jwt.defaultDuration;
    }

    const user = await userLogin(params.email);
    if (!user) {
        throw new Unauthorized("Could not find user");
    }

    const isValidPassword = await checkPasswordHash(params.password, user.hashedPassword);
    if (!isValidPassword) {
        throw new Unauthorized("incorrect email or password");
    }

    const jwtString = makeJWT((user.id), params.expiresInSeconds, config.jwt.secret);
    if (!jwtString) {
        throw new Unauthorized("Invalid secret string or user id");
    }

    RespondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: jwtString,
    } satisfies LoginResponse);
}