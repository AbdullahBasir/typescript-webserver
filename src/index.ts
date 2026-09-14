import express, { type Express } from 'express';

const app: Express = express();
const port = 8080;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});