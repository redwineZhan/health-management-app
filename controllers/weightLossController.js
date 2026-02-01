const db = require('../../db/config/database');
const weightLossService = require('../../services/weightLossService');
const Joi = require('joi');

// Validation schema for weight loss plans
const weightLossPlanSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().optional(),
  targetWeight: Joi.number().precision(2).positive().required(),
  dailyCalorieTarget: Joi.number().integer().positive().optional(),
  tcmRecommendations: Joi.string().max(2000).optional(),
  notes: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'completed', 'paused', 'cancelled').default('active')
});

const getAllPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const plans = await weightLossService.getAllPlans(userId);

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get weight loss plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getPlanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const plan = await weightLossService.getPlanById(id, userId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Weight loss plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Get weight loss plan by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createPlan = async (req, res) => {
  try {
    // Validate input
    const { error, value } = weightLossPlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const planData = {
      ...value,
      userId
    };

    const newPlan = await weightLossService.createPlan(planData);

    res.status(201).json({
      success: true,
      message: 'Weight loss plan created successfully',
      data: newPlan
    });
  } catch (error) {
    console.error('Create weight loss plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updatePlan = async (req, res) => {
  try {
    // Validate input
    const { error, value } = weightLossPlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const { id } = req.params;
    const planData = {
      ...value,
      userId,
      id
    };

    const updatedPlan = await weightLossService.updatePlan(planData);

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: 'Weight loss plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Weight loss plan updated successfully',
      data: updatedPlan
    });
  } catch (error) {
    console.error('Update weight loss plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deletePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await weightLossService.deletePlan(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Weight loss plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Weight loss plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete weight loss plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
};