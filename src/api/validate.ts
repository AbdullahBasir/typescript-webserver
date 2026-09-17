import type { Request, Response } from 'express';
import { RespondWithError, RespondWithJSON } from './json.js';

export const validateHandler = (req: Request, res: Response) => {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;

    if (params.body.length >= 140) {
        RespondWithError(res, 400, "Chirp is too long");
        return 
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