# Docker Deployment Guide

## Local Development with Docker Compose

### Build and Run Containers

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Production Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (optional for orchestration)
- Kubernetes 1.20+ (optional for K8s deployment)

### Build for Production

```bash
# Build images with production tag
docker build -t focus-flow-frontend:latest -f frontend/Dockerfile ./frontend
docker build -t focus-flow-backend:latest -f backend/Dockerfile ./backend

# Push to registry (example with Docker Hub)
docker tag focus-flow-frontend:latest yourusername/focus-flow-frontend:latest
docker tag focus-flow-backend:latest yourusername/focus-flow-backend:latest
docker push yourusername/focus-flow-frontend:latest
docker push yourusername/focus-flow-backend:latest
```

### Docker Compose Production

```bash
# Start with production environment
docker-compose -f docker-compose.yml up -d

# Scale services (if using Docker Swarm)
docker-compose up -d --scale backend=3
```

### Environment Variables

**Frontend (.env.production)**
- `NEXT_PUBLIC_API_URL`: Backend API URL (http://backend:5000 for Docker)

**Backend**
- `NODE_ENV`: Set to `production`
- `PORT`: Service port (default: 5000)
- `CORS_ORIGIN`: Allowed origins for CORS

## Kubernetes Deployment

### Create ConfigMaps and Secrets

```bash
# Frontend config
kubectl create configmap focus-flow-frontend-config \
  --from-literal=NEXT_PUBLIC_API_URL=http://backend-service:5000

# Backend config
kubectl create configmap focus-flow-backend-config \
  --from-literal=NODE_ENV=production \
  --from-literal=PORT=5000
```

### Deploy Manifests

See `k8s/` directory for Kubernetes manifests:
- `frontend-deployment.yml`
- `backend-deployment.yml`
- `services.yml`
- `ingress.yml`

### Health Checks

Both containers include built-in health checks:

**Frontend**: GET `/tasks` returns 200
**Backend**: GET `/api/health` returns 200

Health checks are configured in:
- `frontend/Dockerfile` - HEALTHCHECK instruction
- `backend/Dockerfile` - HEALTHCHECK instruction
- `docker-compose.yml` - healthcheck sections

## Monitoring and Debugging

### View Logs

```bash
# Docker Compose
docker-compose logs -f frontend
docker-compose logs -f backend

# Kubernetes
kubectl logs -f deployment/focus-flow-frontend
kubectl logs -f deployment/focus-flow-backend
```

### Container Shell Access

```bash
# Docker Compose
docker-compose exec frontend sh
docker-compose exec backend sh

# Kubernetes
kubectl exec -it deployment/focus-flow-frontend -- sh
kubectl exec -it deployment/focus-flow-backend -- sh
```

### Resource Monitoring

```bash
# Docker Compose
docker-compose stats

# Kubernetes
kubectl top pods
kubectl top nodes
```

## Performance Optimization

### Image Size Optimization

Using Alpine Linux keeps images small:
- Frontend: ~200MB (with node_modules)
- Backend: ~150MB (with node_modules)

### Production Best Practices

1. **Multi-stage builds**: Frontend uses builder stage to reduce final image size
2. **Signal handling**: dumb-init ensures graceful shutdown
3. **Health checks**: Automatic restart on unhealthy containers
4. **Volume management**: Separate data volumes for persistence
5. **Network isolation**: Services on dedicated bridge network
6. **Port mapping**: Explicit port declarations

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs <container-id>

# Inspect container
docker inspect <container-id>

# Test build locally
docker build -t test . --progress=plain
```

### Health check failing

```bash
# Manual health check
docker exec <container-id> node -e "require('http').get('http://localhost:5000/api/health', (r) => console.log(r.statusCode))"

# Check container environment
docker exec <container-id> env
```

### Network connectivity issues

```bash
# Test network
docker network ls
docker network inspect focus-flow-network

# Test service connectivity
docker exec focus-flow-frontend ping backend
docker exec focus-flow-backend ping frontend
```

## Cleanup

```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker rmi focus-flow-frontend:latest focus-flow-backend:latest

# Prune unused resources
docker system prune -a
```
