import type { Request, Response } from 'express';
import { RespondWithJSON } from './json.js';
import { BadRequest } from '../errors.js';
import { createChirp } from '../db/queries/chirps.js';

export const createChirpHandler = async (req: Request, res: Response) => {
    type parameters = {
        body: string;
        userId: string;
    };

    const params: parameters = req.body;

    if (!params.body) {
        throw new BadRequest("Missing required fields");
    }

    if (params.body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140");
    }

    const badWords: string[] =  ["kerfuffle", "sharbert", "fornax"]
    const words: string[] = params.body.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        }
    }

    const cleanedBody = words.join(" ")

    const chirp = await createChirp({ body: cleanedBody, userId: params.userId })
    if (!chirp) {
        throw new Error("Could not create chirp");
    }

    RespondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId,
    });
}