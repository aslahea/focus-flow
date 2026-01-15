# FocusFlow Docker Setup

This folder contains Docker configuration for microservices deployment.

## Example Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
```

## Docker Files

Create `Dockerfile` in each service directory as needed.
