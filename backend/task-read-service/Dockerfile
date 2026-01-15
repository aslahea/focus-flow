FROM node:20-alpine
WORKDIR /app

# Install tini for proper signal handling
RUN apk add --no-cache tini

# Copy package files and install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy source only
COPY src ./src

EXPOSE 3001

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
