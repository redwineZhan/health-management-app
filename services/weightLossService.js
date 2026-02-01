const db = require('../db/config/database');

/**
 * Get all weight loss plans for a user
 */
const getAllPlans = async (userId) => {
  const query = `
    SELECT * 
    FROM weight_loss_plans 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

/**
 * Get a specific weight loss plan by ID
 */
const getPlanById = async (id, userId) => {
  const query = `
    SELECT * 
    FROM weight_loss_plans 
    WHERE id = $1 AND user_id = $2
  `;
  const result = await db.query(query, [id, userId]);
  return result.rows[0] || null;
};

/**
 * Create a new weight loss plan
 */
const createPlan = async (planData) => {
  const {
    userId, startDate, endDate, targetWeight,
    dailyCalorieTarget, tcmRecommendations, notes, status
  } = planData;
  
  const query = `
    INSERT INTO weight_loss_plans 
    (user_id, start_date, end_date, target_weight, 
     daily_calorie_target, tcm_recommendations, notes, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    userId, startDate, endDate, targetWeight,
    dailyCalorieTarget, tcmRecommendations, notes, status
  ]);
  
  return result.rows[0];
};

/**
 * Update an existing weight loss plan
 */
const updatePlan = async (planData) => {
  const {
    id, userId, startDate, endDate, targetWeight,
    dailyCalorieTarget, tcmRecommendations, notes, status
  } = planData;
  
  const query = `
    UPDATE weight_loss_plans 
    SET start_date = $1, end_date = $2, target_weight = $3,
        daily_calorie_target = $4, tcm_recommendations = $5, 
        notes = $6, status = $7
    WHERE id = $8 AND user_id = $9
    RETURNING *
  `;
  
  const result = await db.query(query, [
    startDate, endDate, targetWeight,
    dailyCalorieTarget, tcmRecommendations, notes, status, id, userId
  ]);
  
  return result.rows[0] || null;
};

/**
 * Delete a weight loss plan
 */
const deletePlan = async (id, userId) => {
  const query = 'DELETE FROM weight_loss_plans WHERE id = $1 AND user_id = $2 RETURNING id';
  const result = await db.query(query, [id, userId]);
  return result.rows.length > 0;
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
};