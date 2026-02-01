const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { 
  getAllCommunities,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity
} = require('../../controllers/communityController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.post('/', createCommunity);
router.put('/:id', updateCommunity);
router.delete('/:id', deleteCommunity);
router.post('/:id/join', joinCommunity);
router.delete('/:id/leave', leaveCommunity);

module.exports = router;