import type { Request, Response } from 'express';
import { RespondWithError, RespondWithJSON } from './json.js';

export const validateHandler = (req: Request, res: Response) => {
    type parameters = {
        body: string;
    };
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    let params: parameters;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        } catch (error) {
            RespondWithError(res, 400, "Invalid JSON");
            return
        }

        if (params.body.length >= 140) {
            RespondWithError(res, 400, "Chirp is too long");
        } else {
            RespondWithJSON(res, 200, { valid: true });
        }
    });
}