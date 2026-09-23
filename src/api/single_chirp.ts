import { Request, Response } from 'express';
import { deleteSingleChirp, getSingleChirp } from '../db/queries/chirps.js'
import { Forbidden, NotFound } from '../errors.js';
import { RespondWithJSON } from './json.js';
import { getBearerToken, validateJWT } from '../auth/auth.js';
import { config } from '../config.js';

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

export const deleteChirpHandler = async (req: Request<ChirpParams>, res: Response) => {
    const chirpId: string = req.params.chirpId

    const chirp = await getSingleChirp(chirpId);
    if (!chirp) {
        throw new NotFound(`Chirp with chirpId: ${chirpId} not found`);
    }

    const bearerToken = getBearerToken(req);
    const userId = validateJWT(bearerToken, config.jwt.secret);

    if (userId !== chirp.userId) {
        throw new Forbidden("not authorized to delete other users chirp");
    }

    await deleteSingleChirp(userId, chirpId);
    res.status(204).send();
}