FROM node:20-alpine
WORKDIR /app

# Install tini for proper signal handling
RUN apk add --no-cache tini

# Copy package files and install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy source and DB
COPY src ./src
COPY db ./db

EXPOSE 3002

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
// commit marker 22
