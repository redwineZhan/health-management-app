const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { 
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
} = require('../../controllers/weightLossController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/plans', getAllPlans);
router.get('/plans/:id', getPlanById);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

module.exports = router;