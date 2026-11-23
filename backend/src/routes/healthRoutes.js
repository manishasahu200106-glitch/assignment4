const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = mongoose.connection.readyState === 1 || process.env.NODE_ENV === 'test';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      server: 'healthy',
      database: dbStatus,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
