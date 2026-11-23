const express = require('express');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { validatePost } = require('../middleware/validatePost');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(validatePost, createPost);

router.route('/:id')
  .get(getPostById)
  .put(validatePost, updatePost)
  .delete(deletePost);

module.exports = router;
