import { Request, Response } from 'express';
import { getBearerToken, makeJWT } from '../auth/auth.js';
import { getUserFromRefreshToken } from '../db/queries/refresh_tokens.js';
import { Unauthorized } from '../errors.js';
import { RespondWithJSON } from './json.js';
import { config } from '../config.js';

export const refreshJWTHandler = async (req: Request, res: Response) => {
    const bearerToken = getBearerToken(req);

    const user = await getUserFromRefreshToken(bearerToken);
    if (!user) {
        throw new Unauthorized("could not get user from refresh token");
    }

    const jwt = makeJWT(user.userId, config.jwt.defaultDuration, config.jwt.secret);
    if (!jwt) {
        throw new Unauthorized("could not make new jwt token");
    }

    RespondWithJSON(res, 200, { token: jwt })
}