const db = require('../db/config/database');
const habitTrackingService = require('../services/habitTrackingService');
const Joi = require('joi');

// Validation schema for habit tracking
const habitTrackingSchema = Joi.object({
  dateRecorded: Joi.date().iso().required(),
  morningMeasurements: Joi.object().optional(),
  eveningMeasurements: Joi.object().optional(),
  dailyHabits: Joi.object().optional(), // { diet_quality, exercise_minutes, sleep_hours, water_intake, stress_level }
  moodRating: Joi.number().integer().min(1).max(10).optional(),
  sleepHours: Joi.number().precision(1).min(0).max(24).optional(),
  waterIntakeLiters: Joi.number().precision(1).min(0).max(15).optional()
});

const getAllLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 50, offset = 0 } = req.query;

    const logs = await habitTrackingService.getAllLogs(userId, {
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Get habit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getLogById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const log = await habitTrackingService.getLogById(id, userId);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Habit log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Get habit log by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createLog = async (req, res) => {
  try {
    // Validate input
    const { error, value } = habitTrackingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const logData = {
      ...value,
      userId
    };

    const newLog = await habitTrackingService.createLog(logData);

    res.status(201).json({
      success: true,
      message: 'Habit log created successfully',
      data: newLog
    });
  } catch (error) {
    console.error('Create habit log error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateLog = async (req, res) => {
  try {
    // Validate input
    const { error, value } = habitTrackingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const { id } = req.params;
    const logData = {
      ...value,
      userId,
      id
    };

    const updatedLog = await habitTrackingService.updateLog(logData);

    if (!updatedLog) {
      return res.status(404).json({
        success: false,
        message: 'Habit log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit log updated successfully',
      data: updatedLog
    });
  } catch (error) {
    console.error('Update habit log error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await habitTrackingService.deleteLog(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Habit log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit log deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit log error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog
};