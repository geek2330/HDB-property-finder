import { Router } from 'express';
import { healthCheckHandler, pingHandler } from './health';

export const apiRouter = Router();

// Route: GET /api/health
apiRouter.get('/health', healthCheckHandler);

// Route: GET /api/ping
apiRouter.get('/ping', pingHandler);

export * from './health';
