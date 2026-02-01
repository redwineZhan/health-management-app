const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { 
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog
} = require('../../controllers/habitTrackingController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', getAllLogs);
router.get('/:id', getLogById);
router.post('/', createLog);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);

module.exports = router;