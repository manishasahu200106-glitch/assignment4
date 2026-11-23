const { body, validationResult } = require('express-validator');

const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('author')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Author name cannot exceed 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

module.exports = { validatePost };
