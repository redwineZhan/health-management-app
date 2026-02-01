const db = require('../db/config/database');
const healthMetricService = require('../services/healthMetricService');
const Joi = require('joi');

// Validation schema for health metrics
const healthMetricSchema = Joi.object({
  measurementDate: Joi.date().iso().required(),
  systolicBp: Joi.number().integer().min(70).max(250).optional(), // Blood pressure: systolic
  diastolicBp: Joi.number().integer().min(40).max(150).optional(), // Blood pressure: diastolic
  heartRate: Joi.number().integer().min(30).max(200).optional(),
  bmi: Joi.number().precision(1).min(10).max(60).optional(),
  bloodSugar: Joi.number().precision(1).min(50).max(600).optional(), // mg/dL
  cholesterolTotal: Joi.number().precision(1).min(100).max(500).optional(),
  cholesterolHdl: Joi.number().precision(1).min(20).max(150).optional(),
  cholesterolLdl: Joi.number().precision(1).min(30).max(300).optional(),
  weightKg: Joi.number().precision(2).positive().optional(),
  notes: Joi.string().max(500).optional()
});

const getAllHealthMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 50, offset = 0 } = req.query;

    const metrics = await healthMetricService.getAllMetrics(userId, {
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getHealthMetricById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const metric = await healthMetricService.getMetricById(id, userId);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.status(200).json({
      success: true,
      data: metric
    });
  } catch (error) {
    console.error('Get health metric by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createHealthMetric = async (req, res) => {
  try {
    // Validate input
    const { error, value } = healthMetricSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const healthData = {
      ...value,
      userId
    };

    const newMetric = await healthMetricService.createMetric(healthData);

    res.status(201).json({
      success: true,
      message: 'Health metric recorded successfully',
      data: newMetric
    });
  } catch (error) {
    console.error('Create health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateHealthMetric = async (req, res) => {
  try {
    // Validate input
    const { error, value } = healthMetricSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const { id } = req.params;
    const healthData = {
      ...value,
      userId,
      id
    };

    const updatedMetric = await healthMetricService.updateMetric(healthData);

    if (!updatedMetric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health metric updated successfully',
      data: updatedMetric
    });
  } catch (error) {
    console.error('Update health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteHealthMetric = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await healthMetricService.deleteMetric(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health metric deleted successfully'
    });
  } catch (error) {
    console.error('Delete health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getHealthTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30', metricType = 'all' } = req.query; // period in days

    const trends = await healthMetricService.getTrends(userId, {
      period: parseInt(period),
      metricType
    });

    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllHealthMetrics,
  getHealthMetricById,
  createHealthMetric,
  updateHealthMetric,
  deleteHealthMetric,
  getHealthTrends
};