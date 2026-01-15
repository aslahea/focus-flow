# Migration Guide: From Monolith to Microservices

## What Changed

The FocusFlow application has been successfully converted from a Next.js full-stack monolith into a microservices architecture with separate frontend and backend services.

## Directory Structure Changes

### Before (Monolith)
```
focus-flow/
├── app/
│   ├── page.tsx
│   ├── api/tasks/        ← Backend API here
│   ├── tasks/
│   └── ...
├── components/
├── lib/                   ← Shared utils and tasks.ts
└── public/
```

### After (Microservices)
```
focus-flow/
├── frontend/             ← React/Next.js frontend only
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/              ← Express.js backend API
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── db/
│   └── package.json
│
└── docker/               ← Docker configuration
```

## Key Changes

### 1. Backend Separation

**What was moved:**
- `app/api/tasks/route.ts` → `backend/src/routes/taskRoutes.js`
- `app/api/tasks/[id]/route.ts` → `backend/src/controllers/taskController.js`
- `lib/tasks.ts` → `backend/src/services/taskService.js`

**New features:**
- Express.js server on port 5000
- CORS enabled for frontend communication
- JSON file-based persistence in `backend/src/db/tasks.json`
- Proper middleware stack

### 2. Frontend Changes

**Type imports updated:**
```typescript
// Before
import type { Task } from "@/lib/tasks"

// After
import type { Task } from "@/lib/types"
```

**API calls updated:**
```typescript
// Before
fetch('/api/tasks')

// After
fetch('http://localhost:5000/tasks')
```

### 3. API Endpoints (No Change in Functionality)

All endpoints remain the same:
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Development Workflow

### Before
```bash
npm install
npm run dev  # Runs both frontend and backend
```

### After
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev  # Port 5000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev  # Port 3000
```

## Dependencies

### Frontend
- Next.js, React, TypeScript (unchanged)
- No backend dependencies removed
- Uses SWR for data fetching from backend API

### Backend
- **New dependencies:**
  - `express` ^4.18.2
  - `cors` ^2.8.5
  - `nodemon` ^3.0.2 (dev)

## Environment Variables

### Backend (.env optional)
```
PORT=5000
```

### Frontend
Frontend automatically connects to backend on port 5000.

## CORS Configuration

The backend is configured to accept requests from:
- Frontend: `http://localhost:3000`

To modify, update `backend/src/server.js`:
```javascript
cors({
  origin: 'http://localhost:3000', // Change here
  credentials: true,
})
```

## Data Persistence

- **Before:** In-memory storage (lost on restart)
- **After:** JSON file at `backend/src/db/tasks.json`

Data persists across server restarts.

## Benefits of This Architecture

✅ **Scalability** - Services can be scaled independently
✅ **Separation of Concerns** - Frontend and backend are decoupled
✅ **Technology Flexibility** - Backend can be replaced/upgraded independently
✅ **Containerization** - Each service can be containerized separately
✅ **Maintainability** - Clear separation makes code easier to maintain

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/src/server.js`
- Verify API_BASE_URL in `frontend/app/tasks/page.tsx`

### Tasks data not persisting
- Check `backend/src/db/tasks.json` exists
- Ensure write permissions on `/backend/src/db/`
- Backend must be running when tasks are created

### Port conflicts
- Ensure ports 3000 (frontend) and 5000 (backend) are available
- Modify PORT in respective package.json if needed

## Next Steps

### Ready for Production
1. Add environment variable configuration
2. Set up database (PostgreSQL/MongoDB) instead of JSON
3. Implement authentication/authorization
4. Add API documentation (Swagger/OpenAPI)
5. Set up CI/CD pipelines

### Ready for Containerization
1. Create Dockerfile for each service
2. Set up docker-compose for local development
3. Push to container registry
4. Deploy to Kubernetes/Docker Swarm

## Rollback (If Needed)

If you need to revert to monolith:
1. Move frontend files back to root `app/`, `components/`
2. Convert backend service files back to Next.js route handlers
3. Merge package.json dependencies
4. Update all imports back to relative paths

---

For questions or issues, refer to:
- Backend README: `backend/README.md`
- Root README: `README.md`
- Docker guide: `docker/README.md`
// commit marker 4
