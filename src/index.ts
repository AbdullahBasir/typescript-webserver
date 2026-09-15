import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 8080;

app.use("/app", express.static("./src/app"))
app.use("/assets", express.static("./src/app/assets"))

app.get('/healthz', (req: Request, res: Response) => {
    res.status(200)
    res.set('Content-Type', 'text/plain; charset=utf-8')
    res.send("OK");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});