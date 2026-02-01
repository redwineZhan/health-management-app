const db = require('../../db/config/database');
const healthMetricService = require('../healthMetricService');

// Function to check if any health metrics are out of normal range
const checkAbnormalReadings = async (userId, days = 1) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Get recent health metrics for the user
  const recentMetrics = await healthMetricService.getAllMetrics(userId, {
    startDate: startDate.toISOString().split('T')[0]
  });
  
  const alerts = [];
  
  for (const metric of recentMetrics) {
    // Check blood pressure
    if (metric.systolic_bp && metric.diastolic_bp) {
      if (metric.systolic_bp > 140 || metric.diastolic_bp > 90) {
        alerts.push({
          id: `bp-${metric.id}`,
          type: 'blood_pressure_high',
          message: `High blood pressure reading: ${metric.systolic_bp}/${metric.diastolic_bp} mmHg`,
          severity: 'warning',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      } else if (metric.systolic_bp < 90 || metric.diastolic_bp < 60) {
        alerts.push({
          id: `bp-low-${metric.id}`,
          type: 'blood_pressure_low',
          message: `Low blood pressure reading: ${metric.systolic_bp}/${metric.diastolic_bp} mmHg`,
          severity: 'warning',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      }
    }
    
    // Check heart rate
    if (metric.heart_rate) {
      if (metric.heart_rate > 100) {
        alerts.push({
          id: `hr-high-${metric.id}`,
          type: 'heart_rate_high',
          message: `High heart rate: ${metric.heart_rate} bpm`,
          severity: 'warning',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      } else if (metric.heart_rate < 60) {
        alerts.push({
          id: `hr-low-${metric.id}`,
          type: 'heart_rate_low',
          message: `Low heart rate: ${metric.heart_rate} bpm`,
          severity: 'warning',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      }
    }
    
    // Check BMI
    if (metric.bmi) {
      if (metric.bmi < 18.5) {
        alerts.push({
          id: `bmi-under-${metric.id}`,
          type: 'bmi_underweight',
          message: `Underweight BMI: ${metric.bmi}`,
          severity: 'info',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      } else if (metric.bmi >= 25 && metric.bmi < 30) {
        alerts.push({
          id: `bmi-over-${metric.id}`,
          type: 'bmi_overweight',
          message: `Overweight BMI: ${metric.bmi}`,
          severity: 'info',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      } else if (metric.bmi >= 30) {
        alerts.push({
          id: `bmi-obese-${metric.id}`,
          type: 'bmi_obese',
          message: `Obese BMI: ${metric.bmi}`,
          severity: 'warning',
          timestamp: metric.metricId,
          metricId: metric.id
        });
      }
    }
    
    // Check blood sugar (fasting)
    if (metric.blood_sugar) {
      if (metric.blood_sugar > 126) { // mg/dL
        alerts.push({
          id: `bs-high-${metric.id}`,
          type: 'blood_sugar_high',
          message: `High fasting blood sugar: ${metric.blood_sugar} mg/dL`,
          severity: 'warning',
          timestamp: metric.measurement_date,
          metricId: metric.id
        });
      }
    }
  }
  
  return alerts;
};

const getUserAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get abnormal readings from health metrics
    const abnormalReadings = await checkAbnormalReadings(userId, 7); // Check last 7 days
    
    // Sort alerts by timestamp (newest first)
    const sortedAlerts = [...abnormalReadings].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.status(200).json({
      success: true,
      data: sortedAlerts
    });
  } catch (error) {
    console.error('Get user alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getLatestAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    
    // Get abnormal readings
    const abnormalReadings = await checkAbnormalReadings(userId, 30); // Check last 30 days
    
    // Sort and limit alerts
    const sortedAlerts = [...abnormalReadings].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: sortedAlerts
    });
  } catch (error) {
    console.error('Get latest alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUserAlerts,
  getLatestAlerts
};