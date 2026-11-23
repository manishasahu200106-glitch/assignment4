const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const connectDB = async () => {
  const envUri = process.env.MONGO_URI;

  if (envUri && envUri !== 'mongodb://localhost:27017/mern_blog') {
    try {
      console.log(`[MongoDB] Connecting to specified URI: ${envUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
      const conn = await mongoose.connect(envUri, { serverSelectionTimeoutMS: 6000 });
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[MongoDB Warning] Could not connect to external MONGO_URI: ${err.message}`);
    }
  }

  // Try local MongoDB first if default URI
  try {
    const conn = await mongoose.connect(envUri || 'mongodb://localhost:27017/mern_blog', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to local MongoDB: ${conn.connection.host}`);
    return;
  } catch (localErr) {
    console.log(`[MongoDB] Local MongoDB not running on 27017. Starting self-contained In-Memory MongoDB Engine...`);
  }

  // Graceful fallback to MongoMemoryServer
  try {
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[MongoDB] In-Memory Database initialized and connected.`);

    // Seed sample posts if database is empty
    const Post = require('../models/Post');
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.create([
        {
          title: 'Welcome to CloudBlog!',
          content: 'This full-stack MERN blog is running live with TanStack Query, Express.js, and MongoDB.',
          author: 'DevOps Lead',
          tags: ['welcome', 'mern', 'docker'],
        },
        {
          title: 'Containerization with Docker & Compose',
          content: 'Multi-stage builds and isolated networking enable seamless cloud and local deployment.',
          author: 'Cloud Engineer',
          tags: ['docker', 'devops', 'cloud'],
        },
      ]);
      console.log(`[MongoDB] Seeded initial blog posts.`);
    }
  } catch (memErr) {
    console.error(`[MongoDB Error] Failed to initialize database: ${memErr.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
