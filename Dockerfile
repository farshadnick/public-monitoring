# Use full Node.js image instead of alpine (faster for npm installs)
FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose output and network timeout
RUN npm install --loglevel=verbose --fetch-timeout=60000 || \
    (echo "First install failed, retrying..." && npm install --loglevel=info)

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage - use slim image for smaller size
FROM node:18-slim AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Install only production dependencies in runner
COPY package*.json ./
RUN npm install --production --fetch-timeout=60000

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./

# Copy source files needed at runtime
COPY lib ./lib
COPY types ./types
COPY app ./app

# Create directories for data and config
RUN mkdir -p /app/data /app/prometheus-config

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

