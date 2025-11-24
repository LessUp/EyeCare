# Multi-stage Dockerfile for Next.js (EyeCare Pro)

# 1) Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install OS deps if needed later (e.g., for sharp). Keep minimal for now.
# RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* npm-shrinkwrap.json* ./

RUN npm install

# 2) Build
FROM node:20-alpine AS builder
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3) Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Only copy what we need to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json* npm-shrinkwrap.json* ./

# Install only production deps
RUN npm install --omit=dev --ignore-scripts

EXPOSE 3000

CMD ["npm", "start"]
