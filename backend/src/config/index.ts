import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from backend/.env explicitly, then fallback to default dotenv
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  frontendUrl: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://wayfarer:wayfarer_dev@localhost:5433/wayfarer?schema=public',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;
