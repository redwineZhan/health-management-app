const express = require('express');
const { authenticateToken } = require('../../middleware/auth');
const { getUserAlerts, getLatestAlerts } = require('../../controllers/alertController');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

router.get('/', getUserAlerts);
router.get('/latest', getLatestAlerts);

module.exports = router;