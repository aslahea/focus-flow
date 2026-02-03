# =====================
# Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .

# Build using explicit Next.js binary
RUN node node_modules/next/dist/bin/next build


# =====================
# Runtime stage
# =====================
FROM node:20-alpine AS runner

WORKDIR /app

# Required for Next.js on Alpine
RUN apk add --no-cache dumb-init libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Copy node_modules WITH permissions intact
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

# Use node directly instead of npm
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
