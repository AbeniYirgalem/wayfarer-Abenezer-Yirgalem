FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma runtime on Alpine Linux
RUN apk add --no-cache openssl

# Install package dependencies
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and configuration
COPY prisma ./prisma
COPY prisma.config.ts ./

# Generate Prisma Client
ENV DATABASE_URL="postgresql://wayfarer:wayfarer_dev@postgres:5432/wayfarer?schema=public"
RUN npx prisma generate

# Copy source code, test suite, and build TypeScript
COPY tsconfig.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests
RUN npm run build

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Apply migrations, seed database, and launch Express server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"]

