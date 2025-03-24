# Use the official Node.js image
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache libc6-compat openssl python3 make g++

WORKDIR /app

# Copy only package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Set up production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder with correct permissions
COPY --from=base --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/prisma ./prisma

# For standalone output
RUN if [ -d /app/.next/standalone ]; then \
    mkdir -p /app/.next/standalone/.next && \
    chown -R nextjs:nodejs /app/.next/standalone; \
    fi

USER nextjs

EXPOSE 3000

# Use the standalone server if it exists, otherwise use normal next start
CMD ["sh", "-c", "if [ -d .next/standalone ]; then node .next/standalone/server.js; else npm run start; fi"]