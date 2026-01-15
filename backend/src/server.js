import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // In development allow localhost (any port) and common private IP ranges.
      // In production, let the runtime env or a proper reverse proxy enforce CORS.
      if (process.env.NODE_ENV !== 'production') {
        if (!origin) return callback(null, true); // non-browser requests
        const allowedPatterns = [
          /^http:\/\/localhost(?::\d+)?$/,
          /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
          /^http:\/\/192\.168\.\d+\.\d+(?::\d+)?$/,
          /^http:\/\/10\.\d+\.\d+\.\d+(?::\d+)?$/,
          /^http:\/\/172\.\d+\.\d+\.\d+(?::\d+)?$/,
        ];
        if (allowedPatterns.some(pattern => pattern.test(origin))) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      }

      // Production: allow explicit origin via env FRONTEND_ORIGIN or fall back to strict check.
      const frontendOrigin = process.env.FRONTEND_ORIGIN;
      if (frontendOrigin) {
        return callback(null, frontendOrigin === origin);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Routes
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
