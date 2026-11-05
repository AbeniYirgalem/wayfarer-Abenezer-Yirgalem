FROM node:20-alpine

WORKDIR /app

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
COPY package*.json ./
RUN npm ci

# Argument and environment variable for API URL (baked into client bundles at build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy configuration, assets, and source code
COPY next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs ./
COPY public ./public
COPY src ./src

# Build Next.js application
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]

