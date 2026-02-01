// Integration test for Health Management App
// tests/integration.test.js

const request = require('supertest');
const app = require('../server'); // Adjust path to your main server file
const db = require('../db/config/database');

describe('Health Management App - Integration Tests', () => {
  // Mock data for testing
  const testUser = {
    email: 'integration@test.com',
    password: 'securePassword123',
    firstName: 'Integration',
    lastName: 'Tester'
  };
  
  const testMetric = {
    measurementDate: new Date().toISOString(),
    systolicBp: 120,
    diastolicBp: 80,
    heartRate: 75,
    bmi: 22.5
  };

  let authToken = '';
  let userId = '';
  let metricId = '';

  beforeAll(async () => {
    // Clean up any existing test data
    await db.query('DELETE FROM health_metrics WHERE user_id IN (SELECT id FROM users WHERE email = $1)', [testUser.email]);
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  afterAll(async () => {
    // Clean up test data after tests
    await db.query('DELETE FROM health_metrics WHERE user_id IN (SELECT id FROM users WHERE email = $1)', [testUser.email]);
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  test('1. Should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(testUser.email);
    
    userId = response.body.data.user.id;
    authToken = response.body.data.accessToken;
  });

  test('2. Should login the user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  test('3. Should create a health metric', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testMetric)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.systolic_bp).toBe(testMetric.systolicBp);
    
    metricId = response.body.data.id;
  });

  test('4. Should retrieve the created health metric', async () => {
    const response = await request(app)
      .get(`/api/health/${metricId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(metricId);
  });

  test('5. Should retrieve all health metrics for the user', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('6. Should update the health metric', async () => {
    const updatedMetric = {
      ...testMetric,
      systolicBp: 118,
      diastolicBp: 78
    };

    const response = await request(app)
      .put(`/api/health/${metricId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedMetric)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.systolic_bp).toBe(updatedMetric.systolicBp);
  });

  test('7. Should create a weight loss plan', async () => {
    const planData = {
      startDate: new Date().toISOString().split('T')[0],
      targetWeight: 70.0,
      dailyCalorieTarget: 1800,
      tcmRecommendations: 'Include warming foods like ginger and cinnamon'
    };

    const response = await request(app)
      .post('/api/weight-loss/plans')
      .set('Authorization', `Bearer ${authToken}`)
      .send(planData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.target_weight).toBe(planData.targetWeight);
  });

  test('8. Should retrieve all weight loss plans', async () => {
    const response = await request(app)
      .get('/api/weight-loss/plans')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('9. Should create a habit tracking log', async () => {
    const logData = {
      dateRecorded: new Date().toISOString().split('T')[0],
      morningMeasurements: { weight: 75.2, bloodPressure: '120/80', heartRate: 75 },
      eveningMeasurements: { weight: 75.0, bloodPressure: '118/78', heartRate: 72 },
      dailyHabits: { 
        dietQuality: 7, 
        exerciseMinutes: 30, 
        sleepHours: 7.5, 
        waterIntake: 2.5, 
        stressLevel: 5 
      },
      moodRating: 8,
      sleepHours: 7.5,
      waterIntakeLiters: 2.5
    };

    const response = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${authToken}`)
      .send(logData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.date_recorded).toBe(logData.dateRecorded);
  });

  test('10. Should retrieve user alerts', async () => {
    const response = await request(app)
      .get('/api/alerts')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});