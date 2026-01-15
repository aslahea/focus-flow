# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Allow passing NEXT_PUBLIC_API_URL at build time so the client bundle is built
# with the correct backend URL when using Docker Compose / CI.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package files and install dev deps for building
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Runtime stage (smaller image with only production deps)
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Expose port
EXPOSE 3000

# Health check (adjust route as needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/tasks', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the app
CMD ["npm", "start"]