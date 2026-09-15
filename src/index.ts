import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { config } from './config.js';

const app: Express = express();
const port = 8080;

const middlewareLogResponses = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const status = res.statusCode;
        if (status === 200) {
            console.log(`[OK] ${req.method} ${req.url} - Status: ${status}`);
        }
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${status}`);
    })
    next()
};

const middlewareMetricsInc = (req: Request, res: Response, next: NextFunction) => {
    config.fileserverHits++;
    next()
};

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"))
app.use("/assets", express.static("./src/app/assets"))

app.get('/healthz', (req: Request, res: Response) => {
    res.status(200)
    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.send("OK");
});

app.get('/metrics', (req: Request, res: Response) => {
    res.send(`Hits: ${config.fileserverHits}`);
});

app.get('/reset', (req: Request, res: Response) => {
    config.fileserverHits = 0;
    res.send(`Hits: ${config.fileserverHits}`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});