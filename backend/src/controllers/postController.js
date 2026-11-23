const mongoose = require('mongoose');
const Post = require('../models/Post');

// In-memory fallback store when running in environments without MongoDB connection
let inMemoryPosts = [
  {
    _id: 'sample-post-1',
    title: 'Welcome to CloudBlog on Render!',
    content: 'Your full-stack MERN application is deployed and running live on Render.',
    author: 'DevOps Lead',
    tags: ['render', 'mern', 'cloud', 'devops'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'sample-post-2',
    title: 'Connecting MongoDB Atlas (Persistent Storage)',
    content: 'To persist blog posts across restarts, set the MONGO_URI environment variable in your Render dashboard.',
    author: 'Cloud Architect',
    tags: ['mongodb', 'atlas', 'docker'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all blog posts
// @route   GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const { tag, limit = 20, page = 1 } = req.query;

    if (isDbConnected()) {
      const query = tag ? { tags: tag } : {};
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const [posts, total] = await Promise.all([
        Post.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10)),
        Post.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        count: posts.length,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / limit) || 1,
        data: posts,
      });
    }

    // In-memory fallback
    let filtered = [...inMemoryPosts];
    if (tag) {
      filtered = filtered.filter((p) => p.tags && p.tags.includes(tag.toLowerCase()));
    }
    res.status(200).json({
      success: true,
      count: filtered.length,
      total: filtered.length,
      page: 1,
      totalPages: 1,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
const getPostById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      return res.status(200).json({ success: true, data: post });
    }

    const post = inMemoryPosts.find((p) => p._id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, content, author, tags } = req.body;
    const cleanTags = Array.isArray(tags) ? tags.map((t) => String(t).trim().toLowerCase()) : [];
    const authorName = author && author.trim() !== '' ? author.trim() : 'Anonymous';

    if (isDbConnected()) {
      const post = await Post.create({
        title,
        content,
        author: authorName,
        tags: cleanTags,
      });

      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    }

    // In-memory creation
    const newPost = {
      _id: 'post-' + Date.now(),
      title,
      content,
      author: authorName,
      tags: cleanTags,
      createdAt: new Date().toISOString(),
    };
    inMemoryPosts.unshift(newPost);

    res.status(201).json({
      success: true,
      message: 'Post created successfully (in-memory mode)',
      data: newPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true, runValidators: true }
      );
      if (!post) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      return res.status(200).json({ success: true, message: 'Post updated', data: post });
    }

    const index = inMemoryPosts.findIndex((p) => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    inMemoryPosts[index] = { ...inMemoryPosts[index], ...req.body };
    res.status(200).json({ success: true, message: 'Post updated', data: inMemoryPosts[index] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      return res.status(200).json({ success: true, message: 'Post deleted successfully', data: { id: req.params.id } });
    }

    const index = inMemoryPosts.findIndex((p) => p._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    inMemoryPosts.splice(index, 1);
    res.status(200).json({ success: true, message: 'Post deleted successfully', data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
