import type { Request, Response } from 'express';
import { RespondWithError, RespondWithJSON } from './json.js';

export const validateHandler = (req: Request, res: Response) => {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;

    if (params.body.length >= 140) {
        RespondWithError(res, 400, "Chirp is too long");
    }
    RespondWithJSON(res, 200, { valid: true });
}