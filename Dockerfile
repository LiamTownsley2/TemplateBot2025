# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy config files first
COPY .sentryclirc ./.sentryclirc
COPY package*.json ./
COPY prisma.config.ts ./
COPY tsconfig.json ./

# CRITICAL: Copy the prisma folder (contains schema.prisma and migrations)
COPY prisma ./prisma

# Copy source code
COPY src ./src

# Now install deps — postinstall will find schema.prisma and generate client successfully
RUN npm ci --force

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Optional: copy prisma/ if you plan to run migrations at container startup
# COPY --from=builder /app/prisma ./prisma

# Install only production deps
RUN npm ci --force --only=production

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]