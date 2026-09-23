import * as argon2 from 'argon2';
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequest, Unauthorized } from '../errors.js';
import { Request } from 'express';
import { config } from '../config.js';
import { randomBytes } from 'crypto'

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error('Failed to hash password');
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        const isValid = await argon2.verify(hash, password);
        return isValid;
    } catch (err) {
        throw new Error('Failed to verify password');
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">

    const timeNow: number = Math.floor(Date.now() / 1000);

    const signPayload: payload = {
        iss: config.jwt.issuer,
        sub: userID,
        iat: timeNow,
        exp: timeNow + expiresIn,
    };

    return jwt.sign(signPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let userId: string

    try {
        const token = jwt.verify(tokenString, secret)
        if (typeof token === "string") {
            throw new Error("Token is a string, expected object");
        }

        userId = token.sub!;
    } catch (err) {
        console.error(err);
        throw new Unauthorized("token is invalid or has expired");
    }
    return userId;
}

export function getBearerToken(req: Request): string {
    const header = req.get('Authorization');
    if (!header) {
        throw new BadRequest("Malformed authorization header");
    }
    
    const splitHeader = header.trim().replace(/\s+/g, " ").split(" ");
    if (splitHeader.length < 2 || splitHeader[0] !== "Bearer") {
        throw new BadRequest("Malformed authorization header");
    }

    return splitHeader[1];
}

export function makeRefreshToken(): string {
    const encodedstring = randomBytes(32);
    return encodedstring.toString('hex');
}