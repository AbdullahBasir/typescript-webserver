import express, { Express } from 'express';
import { middlewareErrorHandler, middlewareLogResponses, middlewareMetricsInc } from './api/middleware.js';
import { metricsHandler } from './api/metrics.js';
import { healthHandler } from './api/health.js';
import { resetHandler } from './api/reset.js';
import { validateHandler } from './api/validate.js'
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js"

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app: Express = express();

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"))
app.use("/assets", express.static("./src/app/assets"))

app.get('/api/healthz', (req, res, next) => {
    Promise.resolve(healthHandler(req, res)).catch(next);
});
app.get('/admin/metrics', (req, res, next) => {
    Promise.resolve(metricsHandler(req, res)).catch(next);
});
app.get('/admin/reset', (req, res, next) => {
    Promise.resolve(resetHandler(req, res)).catch(next);
});

app.post('/api/validate_chirp', (req, res, next) => {
    Promise.resolve(validateHandler(req, res)).catch(next);
});

app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});