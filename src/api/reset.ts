import type { Request, Response } from 'express';
import { config } from '../config.js';

export const resetHandler = async (req: Request, res: Response) => {
    config.api.fileserverHits = 0;
    res.send(`Hits: ${config.api.fileserverHits}`);
};