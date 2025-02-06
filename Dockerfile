# Use a builder stage
FROM node:lts-alpine3.20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the application source code (excluding unnecessary files)
COPY . .

# Build the application (for Next.js or similar frameworks)
RUN npm run build

# Final runtime image
FROM node:lts-alpine3.20

WORKDIR /app
# Copy .env file for Prisma to use
COPY .env .env

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

# Expose the port your app runs on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start"]

