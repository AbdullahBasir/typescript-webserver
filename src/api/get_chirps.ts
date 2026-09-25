import { Request, Response } from 'express';
import { getChirps, getChirpsById } from '../db/queries/chirps.js';
import { BadRequest } from '../errors.js';
import { RespondWithJSON } from './json.js';
import { Chirp } from '../db/schema.js';


export const getChirpsHandler = async (req: Request, res: Response) => {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }

    let sortChirps = "";
    let sortChirpsQuery = req.query.sort;
    if (sortChirpsQuery && typeof sortChirpsQuery === "string") {
        sortChirps = sortChirpsQuery;
    }

    if (authorId) {
        const chirpsByAuthor = await getChirpsById(authorId)
        if (chirpsByAuthor) {
            RespondWithJSON(res, 200, compareChirps(sortChirps, chirpsByAuthor));
            return;
        }
    };

    const chirps = await getChirps();
    if (!chirps || chirps.length === 0) {
        throw new BadRequest("could not get chirps");
    }

    RespondWithJSON(res, 200, compareChirps(sortChirps, chirps));
    return;
}

function compareChirps(sort: string, chirps: Chirp[]) {
    if (sort === "desc") {
        return chirps.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
    } else {
        return chirps.sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }
}