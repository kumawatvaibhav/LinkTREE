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

describe('Referral Endpoints', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({
      email: 'referrer@example.com',
      username: 'referrer',
      password_hash: await require('bcryptjs').hash('password123', 10),
    });

    token = require('jsonwebtoken').sign({ id: user.id }, process.env.JWT_SECRET);
  });

  it('GET /api/referrals should fetch referrals', async () => {
    const referredUser = await User.create({
      email: 'referred@example.com',
      username: 'referred',
      password_hash: await require('bcryptjs').hash('password123', 10),
    });

    await Referral.create({
      referrer_id: 1,
      referred_user_id: referredUser.id,
    });

    const res = await request(app)
      .get('/api/referrals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /api/referral-stats should return stats', async () => {
    await Referral.create({
      referrer_id: 1,
      referred_user_id: 2,
    });

    const res = await request(app)
      .get('/api/referral-stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.successfulReferrals).toBe(1);
  });
});