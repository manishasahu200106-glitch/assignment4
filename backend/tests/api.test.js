const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('MERN Blog Backend API Tests', () => {
  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.services.server).toBe('healthy');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new blog post with valid data', async () => {
      const postData = {
        title: 'Building Modern Web Apps',
        content: 'This is a complete guide to containerized MERN applications.',
        author: 'Alex Engineer',
        tags: ['react', 'docker', 'nodejs'],
      };

      const res = await request(app)
        .post('/api/posts')
        .send(postData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(postData.title);
      expect(res.body.data.author).toBe(postData.author);
      expect(res.body.data.tags).toContain('docker');
    });

    it('should fail with 400 when title or content is missing', async () => {
      const invalidData = {
        author: 'Tester',
      };

      const res = await request(app)
        .post('/api/posts')
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/posts', () => {
    it('should return list of blog posts', async () => {
      // Seed a post
      await request(app)
        .post('/api/posts')
        .send({
          title: 'First Post',
          content: 'Hello World',
          author: 'Dev',
          tags: ['intro'],
        });

      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toBe('First Post');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete an existing post', async () => {
      const created = await request(app)
        .post('/api/posts')
        .send({
          title: 'Post to Delete',
          content: 'This post will be deleted',
          author: 'Dev',
        });

      const postId = created.body.data._id;
      const res = await request(app).delete(`/api/posts/${postId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const fetchRes = await request(app).get(`/api/posts/${postId}`);
      expect(fetchRes.statusCode).toBe(404);
    });
  });
});
