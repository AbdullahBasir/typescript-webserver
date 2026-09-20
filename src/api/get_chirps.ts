import { Request, Response } from 'express';
import { getChirps } from '../db/queries/chirps.js';
import { BadRequest } from '../errors.js';
import { RespondWithJSON } from './json.js';


export const getChirpsHandler = async (req: Request, res: Response) => {
    const chirps = await getChirps();
    if (!chirps || chirps.length === 0) {
        throw new BadRequest("could not get chirps");
    }

    RespondWithJSON(res, 200, chirps);
}