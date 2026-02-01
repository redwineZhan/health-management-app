// Sample test file for Health Management App
// tests/app.test.js

const request = require('supertest');
const express = require('express');
const app = express();

// Mock database connection for testing
jest.mock('../db/config/database', () => ({
  query: jest.fn()
}));

describe('Health Management App - API Tests', () => {
  beforeAll(() => {
    // Setup app middleware
    app.use(express.json());
    
    // Import routes
    const authRoutes = require('../routes/auth');
    const healthMetricsRoutes = require('../routes/api/healthMetrics');
    const weightLossRoutes = require('../routes/api/weightLoss');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/health', healthMetricsRoutes);
    app.use('/api/weight-loss', weightLossRoutes);
  });

  describe('Authentication API', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'securepassword',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    test('should login an existing user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'securepassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('Health Metrics API', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'securepassword'
        })
        .expect(200);

      authToken = loginResponse.body.data.accessToken;
    });

    test('should create a new health metric', async () => {
      const metricData = {
        measurementDate: new Date().toISOString(),
        systolicBp: 120,
        diastolicBp: 80,
        heartRate: 75,
        bmi: 22.5
      };

      const response = await request(app)
        .post('/api/health')
        .set('Authorization', `Bearer ${authToken}`)
        .send(metricData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.systolic_bp).toBe(metricData.systolicBp);
    });

    test('should retrieve health metrics', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Weight Loss API', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'securepassword'
        })
        .expect(200);

      authToken = loginResponse.body.data.accessToken;
    });

    test('should create a new weight loss plan', async () => {
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
  });
});