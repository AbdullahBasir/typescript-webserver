import { Request, Response } from "express";
import { getBearerToken } from "../auth/auth.js";
import { revokeToken } from "../db/queries/refresh_tokens.js";
import { Unauthorized } from "../errors.js";


export const revokeJWTHandler = async (req: Request, res: Response) => {
    const bearerToken = getBearerToken(req);

    const revoked = await revokeToken(bearerToken);
    if (!revoked) {
        throw new Unauthorized("could not revoke token");
    }

    res.status(204).send();
}