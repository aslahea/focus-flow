# FocusFlow - Microservices Architecture

A task management and Pomodoro timer application built with a microservices architecture.

## Project Structure

```
project-root/
├── frontend/                 # Next.js React frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and types
│   ├── public/              # Static assets
│   ├── styles/              # Global styles
│   ├── package.json
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── backend/                 # Express.js backend microservice
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── db/              # Data storage (JSON)
│   │   └── server.js        # Express server
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## Features

- ✅ Task Management (Create, Read, Update, Delete)
- ✅ Pomodoro Timer (25min focus / 5min break)
- ✅ Settings Customization
- ✅ Persistent Storage (JSON-based)
- ✅ Microservices Architecture
- ✅ CORS Enabled
- ✅ Hot Reload Development

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/:id` | Get a specific task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## Environment Variables

### Backend

Create `backend/.env` if needed:

```
PORT=5000
```

### Frontend

Frontend communicates with backend at `http://localhost:5000`

## Technologies

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- SWR (Data fetching)
- Lucide Icons
- Sonner (Toast notifications)

### Backend

- Express.js
- Node.js
- CORS
- Nodemon (Development)

## Development

Both services have hot-reload enabled:

- **Backend**: Uses Nodemon to watch for changes
- **Frontend**: Next.js dev server with hot module replacement

## Production Build

### Frontend

```bash
cd frontend
npm run build
npm run start
```

### Backend

```bash
cd backend
npm start
```

## Ready for Containerization

This project structure is ready for Docker and Kubernetes deployment:

- ✅ Separate services allow independent scaling
- ✅ Each service has its own dependencies
- ✅ CORS configured for cross-service communication
- ✅ Environment variables support for configuration

## License

MIT
