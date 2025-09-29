import request from 'supertest';
import app from '../server.js';  // Import the app that includes the routes
import userModel from '../models/userModel.js';
import eventModel from '../models/eventModel.js';
import { jest } from '@jest/globals';

// Mock Middleware
const mockRequireSignIn = jest.fn((req, res, next) => {
  req.user = { _id: "mockUserId" };  // Mock user ID
  next();
});

jest.mock('../middlewares/authMiddleware.js', () => ({
  requireSignIn: mockRequireSignIn,
}));

// Mock Models
jest.mock('../models/userModel.js');
jest.mock('../models/eventModel.js');

describe('Auth Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test Register Route
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      userModel.findOne.mockResolvedValue(null);  // Simulate no existing user
      userModel.prototype.save = jest.fn().mockResolvedValue({
        _id: "mockUserId",
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
      });

      const response = await request(app)
        .post('/api/auth/register')  // Use the correct route path
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "123456",
          phone: "1234567890",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });
  });

  // Test Login Route
  describe('POST /api/auth/login', () => {
    it('should log in a user', async () => {
      userModel.findOne.mockResolvedValue({
        _id: "mockUserId",
        email: "john@example.com",
        password: "$2b$10$hashedpassword",
        comparePassword: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .post('/api/auth/login')  // Correct route
        .send({
          email: "john@example.com",
          password: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });
  });

  // Test Participate Route
  describe('PUT /api/auth/participate/:eid', () => {
    it('should allow a user to participate in an event', async () => {
      eventModel.findById.mockResolvedValue({
        _id: "mockEventId",
        users: [],
      });

      userModel.findById.mockResolvedValue({
        _id: "mockUserId",
        events: [],
      });

      userModel.findByIdAndUpdate.mockResolvedValue({
        _id: "mockUserId",
        events: [{ _id: "mockEventId" }],
      });

      eventModel.findByIdAndUpdate.mockResolvedValue({
        _id: "mockEventId",
        users: [{ _id: "mockUserId" }],
      });

      const response = await request(app)
        .put('/api/auth/participate/mockEventId')  // Correct route with the event ID
        .set('Authorization', 'Bearer mockToken')
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(eventModel.findById).toHaveBeenCalledWith("mockEventId");
    });
  });

  // Test Get Participated Events Route
  describe('GET /api/auth/your-participations', () => {
    it('should fetch all participated events', async () => {
      userModel.findById.mockResolvedValue({
        _id: "mockUserId",
        events: [{ _id: "mockEventId", name: "Mock Event" }],
      });

      const response = await request(app)
        .get('/api/auth/your-participations')  // Correct route for fetching participations
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.events.length).toBe(1);
      expect(userModel.findById).toHaveBeenCalledWith("mockUserId");
    });
  });
});
