const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { 
  getAllHealthMetrics, 
  getHealthMetricById, 
  createHealthMetric, 
  updateHealthMetric, 
  deleteHealthMetric,
  getHealthTrends
} = require('../../controllers/healthMetricController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', getAllHealthMetrics);
router.get('/trends', getHealthTrends);
router.get('/:id', getHealthMetricById);
router.post('/', createHealthMetric);
router.put('/:id', updateHealthMetric);
router.delete('/:id', deleteHealthMetric);

module.exports = router;