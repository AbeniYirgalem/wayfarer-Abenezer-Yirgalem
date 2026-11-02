import app from './app';
import config from './config';

const server = app.listen(config.port, () => {
  console.log(`[Wayfarer API] Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`);
  console.log(`[Wayfarer API] Health check endpoint: http://localhost:${config.port}/api/health`);
});

const handleShutdown = (signal: string) => {
  console.log(`[Wayfarer API] ${signal} signal received: closing HTTP server...`);
  server.close(() => {
    console.log('[Wayfarer API] HTTP server closed gracefully.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;

