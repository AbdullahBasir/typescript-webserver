import { Request, Response } from 'express';
import { getSingleChirp } from '../db/queries/chirps.js'
import { NotFound } from '../errors.js';
import { RespondWithJSON } from './json.js';

type ChirpParams = {
    chirpId: string;
};

export const getSingleChirpHandler = async (req: Request<ChirpParams>, res: Response) => {
    const chirpId: string = req.params.chirpId
    const chirp = await getSingleChirp(chirpId);
    if (!chirp) {
        throw new NotFound(`Chirp with chirpId: ${chirpId} not found`);
    }

    RespondWithJSON(res, 200, chirp);
}