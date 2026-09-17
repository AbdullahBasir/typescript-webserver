import type { Response } from 'express';

export const RespondWithError = (res: Response, status: number, message: string) => {
    RespondWithJSON(res, status, { error: message });
};

export const RespondWithJSON = (res: Response, status: number, payload: any) => {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(status).send(body);
};