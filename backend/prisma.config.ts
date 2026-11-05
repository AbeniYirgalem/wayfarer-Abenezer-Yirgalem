import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig, env } from '@prisma/config';

// Ensure backend/.env is loaded regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://wayfarer:wayfarer_dev@localhost:5432/wayfarer?schema=public',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
