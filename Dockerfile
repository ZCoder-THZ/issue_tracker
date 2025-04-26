# Base Image
FROM node:18-alpine AS base

# Install pnpm globally
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install 

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy the correct environment file
COPY .env .env.production
RUN pnpm build  # Changed to pnpm

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
