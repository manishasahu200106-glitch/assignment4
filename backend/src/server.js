const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware (Relaxed CSP for development scripts & inline styles)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.use('/', healthRoutes);
app.use('/api', healthRoutes);

// API Routes
app.use('/api/posts', postRoutes);

// Serve Frontend build if available (Unified full-stack hosting on port 5000)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Frontend] Serving static frontend build from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // If dist doesn't exist, provide a helpful root message
  app.get('/', (req, res) => {
    res.json({
      message: 'MERN Blog API is running. Build frontend (npm run build) to serve UI directly from this port, or visit the Vite dev server at http://localhost:5173',
      endpoints: {
        health: '/health',
        posts: '/api/posts',
      },
    });
  });
}

// 404 & Centralized Error Handlers for API
app.use(notFoundHandler);
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(`🚀 MERN Blog Full-Stack Server LIVE`);
      console.log(`🔗 Local URL: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📦 API Endpoint: http://localhost:${PORT}/api/posts`);
      console.log(`=======================================================`);
    });
  });
}

const handleGracefulShutdown = () => {
  console.log('[Server] Gracefully shutting down...');
  if (server) {
    server.close(() => {
      console.log('[Server] Closed out connections.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', handleGracefulShutdown);
process.on('SIGINT', handleGracefulShutdown);

module.exports = app;
