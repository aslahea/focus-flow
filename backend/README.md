# FocusFlow Backend Microservice

This is the backend microservice for FocusFlow - a task management and Pomodoro timer application.

## Features

- RESTful API for task management
- CORS enabled for frontend communication
- File-based task persistence (JSON)
- Express.js server running on port 5000

## Installation

```bash
npm install
```

## Development

Start the development server with hot-reloading:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Production

```bash
npm start
```

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Health

- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 5000)

## CORS Configuration

The backend accepts requests from `http://localhost:3000` (frontend).

## File Structure

```
src/
├── server.js           # Express app and middleware setup
├── routes/
│   └── taskRoutes.js   # Task route definitions
├── controllers/
│   └── taskController.js # Request handlers
├── services/
│   └── taskService.js  # Business logic
└── db/
    └── tasks.json      # Task storage
```
// commit marker 8
