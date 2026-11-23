const Post = require('../models/Post');

// @desc    Get all blog posts (supports optional tag filter & pagination)
// @route   GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const { tag, limit = 20, page = 1 } = req.query;
    const query = tag ? { tags: tag } : {};
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Post.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, content, author, tags } = req.body;
    const post = await Post.create({
      title,
      content,
      author: author && author.trim() !== '' ? author : 'Anonymous',
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id },
    });
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
