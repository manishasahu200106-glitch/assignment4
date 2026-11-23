const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'in-memory-fallback';

  res.status(200).json({
    status: 'OK',
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
