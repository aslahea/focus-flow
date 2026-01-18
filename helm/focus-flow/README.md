# Focus-Flow — Helm Chart README

## 1. Project Overview

- What Focus-Flow is
  - Focus-Flow is a small, production-oriented microservices example that demonstrates deployment patterns for a Next.js frontend, a Node.js API gateway (backend), and two Node.js services for reading and writing tasks.

- Why it exists
  - To demonstrate production-ready Helm packaging, stateful storage via PVCs, CPU-based autoscaling, and CI/CD integration patterns suitable for AKS and Azure DevOps.

- High-level architecture
  - The frontend communicates with the backend API gateway. The backend coordinates reads and writes by calling `task-read-service` and `task-write-service`. Only `task-write-service` is stateful and uses a PersistentVolumeClaim mounted at `/app/db`.

## 2. Architecture Diagram (ASCII)

frontend (Next.js)
  |
  v
backend (Node.js API Gateway)  <--- HPA (CPU, min=1, max=5)
  |      \
  |       -> task-read-service (stateless)
  |
  -> task-write-service (STATEFUL)  -- PVC mounted at /app/db


## 3. Microservices Breakdown

- frontend
  - Next.js application, stateless. Serves UI and calls `backend` API.

- backend
  - Node.js API gateway. Stateless. Responsible for routing, aggregation, and exposing a single API surface. Horizontal Pod Autoscaler is enabled for `backend` only.

- task-read-service
  - Node.js service, stateless. Reads data (from shared/replicated store or via APIs). Scales horizontally without attached storage.

- task-write-service
  - Node.js service, stateful. Persists data to disk at `/app/db`. Uses a dynamically provisioned PersistentVolumeClaim; mount path is `/app/db`.

- Stateless vs Stateful
  - Stateless: can be scaled horizontally without coordination; no persistent local storage. Examples: frontend, backend, task-read.
  - Stateful: requires persistent storage that survives pod restarts. Example: task-write-service which persists to `/app/db`.

## 4. Kubernetes & Helm Design Decisions

- Why Helm
  - Helm templates enable configurable deployments across environments, parameterized values, and safe upgrades. This chart uses conditionals for optional features (ingress, HTTPRoute, persistence, autoscaling).

- Why only `task-write` uses PVC
  - Only `task-write` requires persistent local storage. Using PVCs only where needed reduces storage consumption and simplifies scaling for stateless services.

- Why HPA only for `backend`
  - The backend is the API gateway and is expected to experience variable traffic patterns. It benefits most from CPU-based autoscaling. The other services are intentionally left without HPA to avoid premature scaling complexity; HPA can be enabled per-service via `values.yaml` if required.

- Why resource requests & limits
  - Requests allow the scheduler to place pods reliably; limits protect nodes and other pods from noisy neighbors. HPA behavior (CPU Utilization) relies on these values being present.

## 5. Deployment Workflow (Local → Production)

1. Build Docker images (CI should handle this):
```bash
# build example (CI should tag & push)
docker build -t <registry>/focus-flow-frontend:1.0 ./frontend
docker build -t <registry>/focus-flow-backend:1.0 ./backend
# similarly for task-read and task-write

# push images
docker push <registry>/focus-flow-frontend:1.0
```

2. Validate Helm chart locally:
```bash
# in helm directory
helm lint focus-flow
helm template focus-flow focus-flow
```

3. Deploy to cluster (AKS):
```bash
# create namespace if missing
kubectl create namespace focus-flow
# install or upgrade
helm upgrade --install focus-flow focus-flow -n focus-flow
```

4. Post-deploy checks:
```bash
kubectl get pods -n focus-flow
kubectl get pvc -n focus-flow
kubectl get hpa -n focus-flow
kubectl describe deployment/backend -n focus-flow
```

## 6. Helm Chart Structure

- Important templates:
  - `backend-deployment.yaml` — backend Deployment, probes, resource configuration.
  - `backend-service.yaml` — ClusterIP Service for backend.
  - `backend-hpa.yaml` — CPU-based HPA for backend (min=1, max=5, target 70%).
  - `task-write-pvc.yaml` — dynamic PersistentVolumeClaim templated under `taskWrite.persistence`.
  - `task-write-deployment.yaml` — mounts PVC at `/app/db` when enabled.
  - `frontend-deployment.yaml`, `task-read-deployment.yaml` — stateless Deployments with probes and resources.
  - `ingress.yaml` / `httproute.yaml` — external routing; the chart provides both templates but only one should be enabled in production according to your chosen ingress provider.

- `values.yaml` highlights:
  - `taskWrite.persistence.enabled` — set `true` to provision PVC and mount `/app/db`.
  - `backend.autoscaling.enabled` — controls backend HPA.
  - Resource request/limit entries for each service.

## 7. CI/CD Pipeline (Azure DevOps) — High-level

- Stages:
  1. Build: build and unit test containers, produce images, push to registry.
  2. Helm lint: run `helm lint` and `helm template` to validate rendering.
  3. Package: `helm package` or prepare chart for deployment.
  4. Deploy: `helm upgrade --install` to a target AKS namespace.
  5. Verify & promote: smoke tests and manual/automated promotion from dev → staging → prod.

- Practical notes:
  - Use pipeline variables to supply image tags and registry credentials.
  - Use environment-specific `values` files (e.g., `values.dev.yaml`, `values.prod.yaml`) and pass with `-f` during `helm upgrade`.

## 8. Commands Reference

- Lint and render:
```bash
helm lint focus-flow
helm template focus-flow focus-flow
```

- Install / upgrade:
```bash
helm upgrade --install focus-flow focus-flow -n focus-flow
```

- Verify resources:
```bash
kubectl get pods -n focus-flow
kubectl get svc -n focus-flow
kubectl get pvc -n focus-flow
kubectl get hpa -n focus-flow
kubectl describe pod <pod-name> -n focus-flow
```

## 9. Production Readiness Checklist

- PVC for `task-write` — ✔ (dynamic, configurable)
- HPA for `backend` — ✔ (CPU-based, min=1 max=5, target 70%)
- Resource requests & limits — ✔ (values supplied in `values.yaml`)
- Health probes — ✔ (liveness/readiness present with safe defaults and overrides)
- Helm upgrade safety — ✔ (chart templates are conditional and idempotent; `helm lint` passes)

## 10. Interview Talking Points

- Why only `task-write` is stateful
  - Persisting application data to local disk requires durable storage; limiting stateful behavior to the component that needs it reduces operational complexity and simplifies scaling and recovery for stateless components.

- Why backend is auto-scaled
  - The backend is the API gateway and is on the critical path for traffic; autoscaling by CPU protects latency and throughput while keeping other services stable.

- Why Helm over raw YAML
  - Helm provides templating, reuse, parameterization, environment separation, and safe upgrades — all important for production multi-environment deployments.

- Why Kubernetes over Docker Compose
  - Kubernetes provides robust orchestration, scheduling, autoscaling, and persistent volume abstractions required for production-grade deployments.

## 11. Author & Notes

- Written by a DevOps Engineer. This README documents production-focused design choices and operational procedures suitable for AKS and Azure DevOps pipelines.

---
If you want, I can also add example `azure-pipelines.yml` snippets for building images and deploying the Helm chart, or create `values.prod.yaml` with recommended production settings.
