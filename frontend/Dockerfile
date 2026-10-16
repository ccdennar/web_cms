
# ==========================================
# SWEETCRUMB BAKERY FRONTEND
# Next.js 14 + pnpm + Docker
# ==========================================

# ==========================================
# STAGE 1: INSTALL DEPENDENCIES
# ==========================================

FROM node:22-alpine AS deps

WORKDIR /app

# Install Alpine compatibility libraries
RUN apk add --no-cache libc6-compat

# Enable pnpm
RUN corepack enable

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install exact dependencies from lockfile
RUN pnpm install --frozen-lockfile


# ==========================================
# STAGE 2: BUILD APPLICATION
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Enable pnpm
RUN corepack enable

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Configure public backend API URL
ARG NEXT_PUBLIC_API_URL=http://localhost:3001

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js
RUN pnpm build


# ==========================================
# STAGE 3: PRODUCTION RUNTIME
# ==========================================

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Create application directory
RUN mkdir -p /app/.next

# Copy standalone server
COPY --from=builder --chown=1001:0 \
    /app/.next/standalone ./

# Copy Next.js static assets
COPY --from=builder --chown=1001:0 \
    /app/.next/static ./.next/static

# The frontend currently has no public/
# directory, so do not copy one.

# Configure permissions
RUN chgrp -R 0 /app \
    && chmod -R g=u /app

# Run as non-root user
USER 1001

# Expose frontend port
EXPOSE 3000

# Start production server
CMD ["node", "server.js"]
