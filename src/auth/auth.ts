import * as argon2 from 'argon2';
import jwt, { JwtPayload } from "jsonwebtoken";
import { Unauthorized } from '../errors.js';

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
        iss: "chirpy",
        sub: userID,
        iat: timeNow,
        exp: timeNow + expiresIn,
    };

    return jwt.sign(signPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    const token = jwt.verify(tokenString, secret)
    if (typeof token === "string") {
        throw new Error("Token is a string, expected object");
    }

    const userId = token.sub;
    if (!userId || typeof userId === "undefined") {
        throw new Unauthorized("token is invalid or has expired");
    }
    return userId;
}