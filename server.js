require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const healthMetricsRoutes = require('./routes/api/healthMetrics');
const weightLossRoutes = require('./routes/api/weightLoss');
const habitTrackingRoutes = require('./routes/api/habitTracking');
const communityRoutes = require('./routes/api/communities');
const communityPostRoutes = require('./routes/api/communityPosts');
const alertRoutes = require('./routes/api/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthMetricsRoutes);
app.use('/api/weight-loss', weightLossRoutes);
app.use('/api/habits', habitTrackingRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', communityPostRoutes);
app.use('/api/alerts', alertRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not Found' 
  });
});

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;