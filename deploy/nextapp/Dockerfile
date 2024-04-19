# Stage 1: Install dependencies and build source code
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --link . .

FROM base AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add libc6-compat python3

# Install dependencies using pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store yes Y | pnpm install

RUN pnpm db:generate
ENV NODE_ENV production
RUN pnpm build

FROM node:20-alpine AS runner
ENV NODE_ENV production
# Bort PORT / HOSTNAME envs are respected by nextjs start/dev.
ENV HOSTNAME=0.0.0.0
ENV PORT=${NEXTJS_APP_PORT:-3000}

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/next.config.mjs \
  /app/apps/portal/package.json \
  ./

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/.next/static ./apps/portal/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/portal/public ./apps/portal/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
# execute npm run start
CMD HOSTNAME="0.0.0.0" node apps/portal/server.js
