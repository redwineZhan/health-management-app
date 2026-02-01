const db = require('../db/config/database');

/**
 * Get all health metrics for a user
 */
const getAllMetrics = async (userId, options = {}) => {
  const { startDate, endDate, limit = 50, offset = 0 } = options;
  
  let query = 'SELECT * FROM health_metrics WHERE user_id = $1';
  let queryParams = [userId];
  let paramIndex = 2;
  
  if (startDate) {
    query += ` AND measurement_date >= $${paramIndex}`;
    queryParams.push(new Date(startDate));
    paramIndex++;
  }
  
  if (endDate) {
    query += ` AND measurement_date <= $${paramIndex}`;
    queryParams.push(new Date(endDate));
    paramIndex++;
  }
  
  query += ` ORDER BY measurement_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);
  
  const result = await db.query(query, queryParams);
  return result.rows;
};

/**
 * Get a specific health metric by ID
 */
const getMetricById = async (id, userId) => {
  const query = 'SELECT * FROM health_metrics WHERE id = $1 AND user_id = $2';
  const result = await db.query(query, [id, userId]);
  return result.rows[0] || null;
};

/**
 * Create a new health metric
 */
const createMetric = async (healthData) => {
  const {
    userId, measurementDate, systolicBp, diastolicBp, heartRate,
    bmi, bloodSugar, cholesterolTotal, cholesterolHdl, cholesterolLdl,
    weightKg, notes
  } = healthData;
  
  const query = `
    INSERT INTO health_metrics 
    (user_id, measurement_date, systolic_bp, diastolic_bp, heart_rate, 
     bmi, blood_sugar, cholesterol_total, cholesterol_hdl, cholesterol_ldl, 
     weight_kg, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
  `;
  
  const result = await db.query(query, [
    userId, measurementDate, systolicBp, diastolicBp, heartRate,
    bmi, bloodSugar, cholesterolTotal, cholesterolHdl, cholesterolLdl,
    weightKg, notes
  ]);
  
  return result.rows[0];
};

/**
 * Update an existing health metric
 */
const updateMetric = async (healthData) => {
  const {
    id, userId, measurementDate, systolicBp, diastolicBp, heartRate,
    bmi, bloodSugar, cholesterolTotal, cholesterolHdl, cholesterolLdl,
    weightKg, notes
  } = healthData;
  
  const query = `
    UPDATE health_metrics 
    SET measurement_date = $1, systolic_bp = $2, diastolic_bp = $3, 
        heart_rate = $4, bmi = $5, blood_sugar = $6, 
        cholesterol_total = $7, cholesterol_hdl = $8, cholesterol_ldl = $9,
        weight_kg = $10, notes = $11
    WHERE id = $12 AND user_id = $13
    RETURNING *
  `;
  
  const result = await db.query(query, [
    measurementDate, systolicBp, diastolicBp, heartRate,
    bmi, bloodSugar, cholesterolTotal, cholesterolHdl, cholesterolLdl,
    weightKg, notes, id, userId
  ]);
  
  return result.rows[0] || null;
};

/**
 * Delete a health metric
 */
const deleteMetric = async (id, userId) => {
  const query = 'DELETE FROM health_metrics WHERE id = $1 AND user_id = $2 RETURNING id';
  const result = await db.query(query, [id, userId]);
  return result.rows.length > 0;
};

/**
 * Get health trends for a user
 */
const getTrends = async (userId, options = {}) => {
  const { period = 30, metricType = 'all' } = options;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);
  
  let query;
  let queryParams = [userId, startDate];
  
  switch(metricType) {
    case 'blood_pressure':
      query = `
        SELECT 
          DATE(measurement_date) as date,
          AVG(systolic_bp) as avg_systolic,
          AVG(diastolic_bp) as avg_diastolic,
          COUNT(*) as readings_count
        FROM health_metrics 
        WHERE user_id = $1 AND measurement_date >= $2 
          AND systolic_bp IS NOT NULL AND diastolic_bp IS NOT NULL
        GROUP BY DATE(measurement_date)
        ORDER BY date
      `;
      break;
    case 'heart_rate':
      query = `
        SELECT 
          DATE(measurement_date) as date,
          AVG(heart_rate) as avg_heart_rate,
          MIN(heart_rate) as min_heart_rate,
          MAX(heart_rate) as max_heart_rate,
          COUNT(*) as readings_count
        FROM health_metrics 
        WHERE user_id = $1 AND measurement_date >= $2 
          AND heart_rate IS NOT NULL
        GROUP BY DATE(measurement_date)
        ORDER BY date
      `;
      break;
    case 'weight':
      query = `
        SELECT 
          DATE(measurement_date) as date,
          AVG(weight_kg) as avg_weight,
          COUNT(*) as readings_count
        FROM health_metrics 
        WHERE user_id = $1 AND measurement_date >= $2 
          AND weight_kg IS NOT NULL
        GROUP BY DATE(measurement_date)
        ORDER BY date
      `;
      break;
    case 'bmi':
      query = `
        SELECT 
          DATE(measurement_date) as date,
          AVG(bmi) as avg_bmi,
          COUNT(*) as readings_count
        FROM health_metrics 
        WHERE user_id = $1 AND measurement_date >= $2 
          AND bmi IS NOT NULL
        GROUP BY DATE(measurement_date)
        ORDER BY date
      `;
      break;
    default: // all metrics
      query = `
        SELECT 
          DATE(measurement_date) as date,
          AVG(systolic_bp) as avg_systolic,
          AVG(diastolic_bp) as avg_diastolic,
          AVG(heart_rate) as avg_heart_rate,
          AVG(bmi) as avg_bmi,
          AVG(blood_sugar) as avg_blood_sugar,
          AVG(cholesterol_total) as avg_cholesterol_total,
          AVG(cholesterol_hdl) as avg_cholesterol_hdl,
          AVG(cholesterol_ldl) as avg_cholesterol_ldl,
          AVG(weight_kg) as avg_weight,
          COUNT(*) as total_readings
        FROM health_metrics 
        WHERE user_id = $1 AND measurement_date >= $2
        GROUP BY DATE(measurement_date)
        ORDER BY date
      `;
      break;
  }
  
  const result = await db.query(query, queryParams);
  return result.rows;
};

module.exports = {
  getAllMetrics,
  getMetricById,
  createMetric,
  updateMetric,
  deleteMetric,
  getTrends
};