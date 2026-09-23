import { Request, Response } from 'express';
import { createUser, updateUser, upgradeUserToRed, userLogin } from '../db/queries/users.js';
import { RespondWithJSON } from './json.js';
import { BadRequest, NotFound, Unauthorized } from '../errors.js';
import { hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken, validateJWT } from '../auth/auth.js';
import { userResponse } from './user_response.js';
import { config } from '../config.js'
import { CreateRefreshToken } from '../db/queries/refresh_tokens.js';

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
        isChirpyRed: user.isChirpyRed,
    };

    RespondWithJSON(res, 201, ommitted);
}

type LoginResponse = userResponse & {
  token: string;
  refreshToken: string;
};

export const userLoginHandler = async (req: Request, res: Response) => {
    type parameters = {
        email: string;
        password: string;
    }

    const params: parameters = req.body;
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

    const jwtString = makeJWT((user.id), config.jwt.defaultDuration, config.jwt.secret);
    if (!jwtString) {
        throw new Unauthorized("Invalid secret string or user id");
    }

    const refreshToken = makeRefreshToken();
    if (!refreshToken) {
        throw new Error("refresh token was not created");
    }

    const date = new Date();
    const expiresAt = new Date(date.getTime() + 60 * 24 * 60 * 60 * 1000)

    const refresh = await CreateRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: expiresAt,
        revokedAt: null,
    });
    if (!refresh) {
        throw new Unauthorized("refresh token not created");
    }

    RespondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
        token: jwtString,
        refreshToken: refreshToken,
    } satisfies LoginResponse);
}

export const updateUserHandler = async (req: Request, res: Response) => {
    type parameters = {
        email: string;
        password: string;
    }

    const params: parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequest("Missing required fields");
    }

    const hashed = await hashPassword(params.password);

    const bearerToken = getBearerToken(req);
    const user = validateJWT(bearerToken, config.jwt.secret);

    const updatedUser = await updateUser(params.email, hashed, user);
    if (!updatedUser) {
        throw new Unauthorized("could not update user");
    }

    RespondWithJSON(res, 200, {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email,
        isChirpyRed: updatedUser.isChirpyRed,
    } satisfies userResponse)
}

export const upgradeUserToRedHandler = async (req: Request, res: Response) => {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    }

    const params: parameters = req.body;
    if (!params.event || params.event !== "user.upgraded" || !params.data) {
        res.status(204).send();
        return;
    }

    const user = await upgradeUserToRed(params.data.userId);
    if (!user) {
        throw new NotFound("could not upgrade user, user not found");
    }
    res.status(204).send();
}