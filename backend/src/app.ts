import express from 'express';
import cors from 'cors';
import { env } from 'process';
import { errorHandler } from './middlewares/error.js';
import { testRouter } from './routes/test.route.js';
import { applicationRouter } from './routes/applications.route.js';

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/test', testRouter);

app.use('/applications', applicationRouter);

app.use(errorHandler);
