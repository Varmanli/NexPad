# Production Dockerfile for NexPad (Next.js 14 + MongoDB, standalone output).
# Designed for Coolify's "Dockerfile" build pack. No secrets are baked in —
# all values below are supplied by Coolify's build/runtime environment.

# ---- deps: install dependencies reproducibly -------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: typecheck + build --------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time — Coolify must provide these
# as build-time variables. MONGODB_URI does not need to be a reachable/real
# connection during build, but is accepted as a build arg for safety since
# next-sitemap.config.js and layout metadata read NEXT_PUBLIC_BASE_URL.
ARG NEXT_PUBLIC_BASE_URL
ARG MONGODB_URI
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV MONGODB_URI=$MONGODB_URI
ENV NODE_ENV=production

RUN npx tsc --noEmit
RUN npm run build

# ---- runner: minimal production image --------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3007
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3007

# Real secrets (MONGODB_URI, JWT_SECRET, ARVAN_*) must be provided as runtime
# environment variables in Coolify — never baked into this image. No
# database seed or migration command runs here.
CMD ["node", "server.js"]
