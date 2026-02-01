const db = require('../db/config/database');

/**
 * Get all habit logs for a user
 */
const getAllLogs = async (userId, options = {}) => {
  const { startDate, endDate, limit = 50, offset = 0 } = options;
  
  let query = 'SELECT * FROM habits_tracking WHERE user_id = $1';
  let queryParams = [userId];
  let paramIndex = 2;
  
  if (startDate) {
    query += ` AND date_recorded >= $${paramIndex}`;
    queryParams.push(new Date(startDate));
    paramIndex++;
  }
  
  if (endDate) {
    query += ` AND date_recorded <= $${paramIndex}`;
    queryParams.push(new Date(endDate));
    paramIndex++;
  }
  
  query += ` ORDER BY date_recorded DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);
  
  const result = await db.query(query, queryParams);
  return result.rows;
};

/**
 * Get a specific habit log by ID
 */
const getLogById = async (id, userId) => {
  const query = 'SELECT * FROM habits_tracking WHERE id = $1 AND user_id = $2';
  const result = await db.query(query, [id, userId]);
  return result.rows[0] || null;
};

/**
 * Create a new habit log
 */
const createLog = async (logData) => {
  const {
    userId, dateRecorded, morningMeasurements, eveningMeasurements,
    dailyHabits, moodRating, sleepHours, waterIntakeLiters
  } = logData;
  
  const query = `
    INSERT INTO habits_tracking 
    (user_id, date_recorded, morning_measurements, evening_measurements, 
     daily_habits, mood_rating, sleep_hours, water_intake_liters)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    userId, dateRecorded, 
    morningMeasurements ? JSON.stringify(morningMeasurements) : null,
    eveningMeasurements ? JSON.stringify(eveningMeasurements) : null,
    dailyHabits ? JSON.stringify(dailyHabits) : null,
    moodRating, sleepHours, waterIntakeLiters
  ]);
  
  return result.rows[0];
};

/**
 * Update an existing habit log
 */
const updateLog = async (logData) => {
  const {
    id, userId, dateRecorded, morningMeasurements, eveningMeasurements,
    dailyHabits, moodRating, sleepHours, waterIntakeLiters
  } = logData;
  
  const query = `
    UPDATE habits_tracking 
    SET date_recorded = $1, morning_measurements = $2, evening_measurements = $3,
        daily_habits = $4, mood_rating = $5, sleep_hours = $6, water_intake_liters = $7
    WHERE id = $8 AND user_id = $9
    RETURNING *
  `;
  
  const result = await db.query(query, [
    dateRecorded,
    morningMeasurements ? JSON.stringify(morningMeasurements) : null,
    eveningMeasurements ? JSON.stringify(eveningMeasurements) : null,
    dailyHabits ? JSON.stringify(dailyHabits) : null,
    moodRating, sleepHours, waterIntakeLiters, id, userId
  ]);
  
  return result.rows[0] || null;
};

/**
 * Delete a habit log
 */
const deleteLog = async (id, userId) => {
  const query = 'DELETE FROM habits_tracking WHERE id = $1 AND user_id = $2 RETURNING id';
  const result = await db.query(query, [id, userId]);
  return result.rows.length > 0;
};

module.exports = {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog
};