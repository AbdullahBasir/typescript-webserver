import express, { Express } from 'express';
import { middlewareLogResponses, middlewareMetricsInc } from './api/middleware.js';
import { metricsHandler } from './api/metrics.js';
import { healthHandler } from './api/health.js';
import { resetHandler } from './api/reset.js';
import { validateHandler } from './api/validate.js'

const app: Express = express();
const port = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"))
app.use("/assets", express.static("./src/app/assets"))

app.get('/api/healthz', healthHandler);
app.get('/admin/metrics', metricsHandler);
app.get('/admin/reset', resetHandler);

app.post('/api/validate_chirp', validateHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});