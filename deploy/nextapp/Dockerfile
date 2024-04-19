# Stage 1: Install dependencies and build source code
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod-deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files and lock files
COPY package.json pnpm* ./
COPY apps/portal/package.json ./apps/portal/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/portal-ui/package.json ./packages/portal-ui/

# Install dependencies using pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

FROM base AS builder
WORKDIR /app
COPY apps ./apps
COPY packages ./packages
COPY package.json pnpm* tsconfig* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN pnpm build

FROM base AS runner
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/portal/node_modules ./apps/portal/node_modules
COPY --from=prod-deps /app/packages/portal-ui/node_modules ./packages/portal-ui/node_modules

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/standalone /app/apps/portal/.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/static /app/apps/portal/.next/standalone/.next/static
COPY --from=builder /app/apps/portal/public /app/apps/portal/.next/standalone/public

RUN chown nextjs:nodejs /app/apps/portal/.next/

USER nextjs

EXPOSE 3000

ENV PORT 3000
# execute npm run start
CMD HOSTNAME="0.0.0.0" node /app/apps/portal/.next/standalone/server.js
