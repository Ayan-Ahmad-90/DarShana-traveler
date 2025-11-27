import request from 'supertest';
import app from '../src/index';

describe('Authentication Tests', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not register duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 2',
        email: 'duplicate@example.com',
        phone: '9876543211',
        password: 'password123',
        confirmPassword: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User 3',
        email: 'duplicate@example.com',
        phone: '9876543212',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.status).toBe(400);
  });
});

describe('Flight Search Tests', () => {
  it('should search flights', async () => {
    const res = await request(app)
      .get('/api/flights/search')
      .query({
        from: 'Delhi',
        to: 'Mumbai',
        date: '2024-01-15',
        passengers: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('should return error for missing parameters', async () => {
    const res = await request(app)
      .get('/api/flights/search')
      .query({
        from: 'Delhi',
      });

    expect(res.status).toBe(400);
  });
});

describe('Train Search Tests', () => {
  it('should search trains', async () => {
    const res = await request(app)
      .get('/api/trains/search')
      .query({
        from: 'Delhi',
        to: 'Mumbai',
        date: '2024-01-15',
        passengers: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
