import type { Request, Response } from 'express';
import { config } from '../config.js';

export const resetHandler = async (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.send(`Hits: ${config.fileserverHits}`);
};