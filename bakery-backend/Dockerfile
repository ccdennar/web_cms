
# syntax=docker/dockerfile:1.7

# ============================================
# STAGE 1: BASE
# ============================================
FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install and activate the pinned pnpm version.
RUN corepack enable \
    && corepack prepare pnpm@12.11.2 --activate

# ============================================
# STAGE 2: DEPENDENCIES
# ============================================
FROM base AS deps

# Native compilation tools.
RUN apk add --no-cache \
    python3 \
    make \
    g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# ============================================
# STAGE 3: BUILD
# ============================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3002

ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

# Build-only placeholders.
# These must not be used as production credentials.
RUN PAYLOAD_SECRET=build-only-not-for-runtime \
    DATABASE_URL=postgresql://build:build@localhost:5432/build \
    pnpm build

# ============================================
# STAGE 4: PRODUCTION RUNTIME
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Prepare writable runtime directories.
RUN mkdir -p \
      /app/data \
      /app/media \
      /app/.next \
    && chown -R 1001:0 \
      /app/data \
      /app/media \
      /app/.next \
    && chmod -R g+rwX \
      /app/data \
      /app/media \
      /app/.next

# Copy standalone Next.js server.
COPY --from=builder --chown=1001:0 \
    /app/.next/standalone ./

# Copy static Next.js assets.
COPY --from=builder --chown=1001:0 \
    /app/.next/static ./.next/static

# Ensure writable runtime directories after copying.
RUN chgrp -R 0 /app/data /app/media /app/.next \
    && chmod -R g+rwX /app/data /app/media /app/.next

# Non-root execution.
USER 1001

EXPOSE 3000

CMD ["node", "server.js"]
