import type { Request, Response } from 'express';
import { RespondWithJSON } from './json.js';

export const validateHandler = async (req: Request, res: Response) => {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;

    if (params.body.length >= 140) {
        throw new Error("Chirp is too long");
    }
    const badWords: string[] =  ["kerfuffle", "sharbert", "fornax"]
    const words: string[] = params.body.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        }
    }
    RespondWithJSON(res, 200, { cleanedBody: words.join(" ") });
}