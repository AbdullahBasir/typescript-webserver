import type { Request, Response } from 'express';
import { config } from '../config.js';
import { Forbidden } from '../errors.js';
import { deleteUsers } from '../db/queries/users.js'

export const resetHandler = async (req: Request, res: Response) => {
    if (config.api.platform !== "dev") {
        console.log(config.api.platform);
        throw new Forbidden("Reset is only allowed in dev environment.");
    }
    await deleteUsers();
    config.api.fileserverHits = 0;
    res.send(`Hits: ${config.api.fileserverHits}`);
};