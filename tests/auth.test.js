const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

const UserModel = require("../models/user");
const ReferralModel = require("../models/referral");

const User = UserModel(sequelize);
const Referral = ReferralModel(sequelize);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  it('POST /api/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
  });

  it('POST /api/login should authenticate a user', async () => {
    await request(app)
      .post('/api/register')
      .send({
        email: 'login@example.com',
        username: 'loginuser',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'loginuser',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/forgot-password should send reset link', async () => {
    await User.create({
      email: 'reset@example.com',
      username: 'resetuser',
      password_hash: await require('bcryptjs').hash('password123', 10),
    });

    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: 'reset@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password reset link sent');
  });
});