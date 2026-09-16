import type { Request, Response, NextFunction} from 'express';
import { config } from '../config.js';

export const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status === 200) {
            console.log(`[OK] ${req.method} ${req.url} - Status: ${status}`);
        }
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    })
    next()
};

export const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
    config.fileserverHits++;
    next()
};