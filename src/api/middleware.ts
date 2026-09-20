import type { Request, Response, NextFunction} from 'express';
import { config } from '../config.js';
import { BadRequest, Unauthorized, Forbidden, NotFound } from '../errors.js';
import { RespondWithError } from "./json.js";

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
    config.api.fileserverHits++;
    next()
};

export const middlewareErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequest) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof Unauthorized) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof Forbidden) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFound) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }
    RespondWithError(res, statusCode, message);
}