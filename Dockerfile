# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY .sentryclirc ./.sentryclirc
COPY package*.json ./
RUN npm ci --force

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --force --only=production

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]