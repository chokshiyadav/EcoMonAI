import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import pushToInfluxRoute from "./routes/pushToInflux.js";
import eventRoute from './routes/eventRoute.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import client from 'prom-client';   // <-- ✅ Prometheus client

dotenv.config();

const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// logging middleware (kept as is)
app.use((req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const responseTimeMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
        const logEntry = {
            endpoint: req.originalUrl,
            method: req.method,
            status: res.statusCode,
            timestamp: new Date().toISOString(),
            responseTime: responseTimeMs
        };

        fs.appendFileSync(path.join(__dirname, 'logs', 'api.log'), JSON.stringify(logEntry) + '\n');
    });

    next();
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ================= Prometheus Metrics Setup =================
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method','route','status'],
    buckets: [0.005,0.01,0.025,0.05,0.1,0.25,0.5,1,2.5,5,10]
});

// middleware to track requests
app.use((req, res, next) => {
    const endTimer = httpRequestDuration.startTimer();
    res.on('finish', () => {
        const route = (req.route && req.route.path) ? req.route.path : req.path;
        httpRequestCounter.inc({ method: req.method, route, status: res.statusCode });
        endTimer({ method: req.method, route, status: res.statusCode });
    });
    next();
});

// ✅ metrics endpoint (before static + catch-all)
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err.message);
    }
});
// ============================================================

// API routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/event', eventRoute);
app.use("/push-to-influx", pushToInfluxRoute);

// static frontend
app.use(express.static(path.join(__dirname,'../client/build')));

// catch-all
app.use('*', function(req,res){
    res.sendFile(path.join(__dirname,'../client/build/index.html'));
});

const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on ${port}`.bgCyan.white);
});

export default app;
