import express, { Application } from 'express';
import cors from 'cors';
import config from './config';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

export function createApp(): Application {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    })
  );

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root healthcheck alias (convenience)
  app.get('/', (_req, res) => {
    res.json({
      name: 'Wayfarer API',
      status: 'operational',
      docs: '/api/health',
    });
  });

  // API routes mounted at /api
  app.use('/api', apiRoutes);

  // 404 handler for unknown routes
  app.use(notFoundHandler);

  // Centralized error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;

