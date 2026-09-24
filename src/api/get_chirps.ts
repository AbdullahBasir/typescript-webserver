import { Request, Response } from 'express';
import { getChirps, getChirpsById } from '../db/queries/chirps.js';
import { BadRequest } from '../errors.js';
import { RespondWithJSON } from './json.js';


export const getChirpsHandler = async (req: Request, res: Response) => {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    const chirpsByAuthor = await getChirpsById(authorId)
    if (chirpsByAuthor) {
        RespondWithJSON(res, 200, chirpsByAuthor);
        return;
    }

    const chirps = await getChirps();
    if (!chirps || chirps.length === 0) {
        throw new BadRequest("could not get chirps");
    }

    RespondWithJSON(res, 200, chirps);
}