const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { 
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../../controllers/communityPostController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;