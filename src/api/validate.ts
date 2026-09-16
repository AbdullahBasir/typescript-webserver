import type { Request, Response } from 'express';

export const validateHandler = (req: Request, res: Response) => {
    type parameters = {
        body: string;
    };
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    let params: parameters;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        } catch (error) {
            res.status(400).send("Invalid JSON");
        }

        if (params.body.length >= 140) {
            res.status(400).format({
                'appliation/json'() {
                    res.send({error: 'Chirp is too long'});
                }
            });
        } else {
            res.status(200).format({
                'appliation/json'() {
                    res.send({valid: true});
                }
            });
        }
    });
}