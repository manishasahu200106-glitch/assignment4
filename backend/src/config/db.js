const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const envUri = process.env.MONGO_URI;

  // 1. Try external MONGO_URI if configured (e.g. MongoDB Atlas)
  if (envUri && envUri !== 'mongodb://localhost:27017/mern_blog') {
    try {
      console.log(`[MongoDB] Connecting to MONGO_URI...`);
      const conn = await mongoose.connect(envUri, { serverSelectionTimeoutMS: 8000 });
      console.log(`[MongoDB] Successfully connected to cloud database: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[MongoDB Warning] Could not connect to external MONGO_URI: ${err.message}`);
    }
  }

  // 2. Try local MongoDB instance
  try {
    const conn = await mongoose.connect(envUri || 'mongodb://localhost:27017/mern_blog', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to local MongoDB: ${conn.connection.host}`);
    return;
  } catch (localErr) {
    console.log(`[MongoDB] Local MongoDB not reachable. Attempting in-memory database...`);
  }

  // 3. Try In-Memory Mongo Engine with Debian 12 compatible version (>= 7.0.3)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14',
      },
    });
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[MongoDB] In-Memory MongoDB Engine (v7.0.14) initialized and connected.`);

    // Seed sample posts
    const Post = require('../models/Post');
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.create([
        {
          title: 'Welcome to CloudBlog on Render!',
          content: 'This full-stack MERN blog is running live with TanStack Query, Express.js, and MongoDB.',
          author: 'DevOps Lead',
          tags: ['welcome', 'mern', 'render'],
        },
        {
          title: 'Containerization & Cloud Architecture',
          content: 'Multi-stage builds and isolated networking enable seamless cloud and local deployment.',
          author: 'Cloud Engineer',
          tags: ['docker', 'devops', 'cloud'],
        },
      ]);
      console.log(`[MongoDB] Seeded initial blog posts.`);
    }
    return;
  } catch (memErr) {
    console.warn(`[MongoDB Notice] In-memory Mongo binary could not be started (${memErr.message}).`);
    console.log(`[MongoDB] Application will run with in-memory memory store. To connect a persistent database, set MONGO_URI in Render environment variables.`);
  }
};

module.exports = connectDB;
