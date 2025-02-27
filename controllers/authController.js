const UserModel = require("../models/user");
const ReferralModel = require("../models/referral");
const ResetTokenModel = require("../models/resetToken");

const sequelize = require('../config/database'); // Your Sequelize instance
const User = UserModel(sequelize);
const Referral = ReferralModel(sequelize);
const ResetToken = ResetTokenModel(sequelize);


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password, referral_code } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    let referred_by = null;
    if (referral_code) {
      const referrer = await User.findOne({ where: { referral_code } });
      if (referrer) {
        referred_by = referrer.id;
      }
    }

    const user = await User.create({
      username,
      email,
      password_hash,
      referred_by,
    });

    if (referred_by) {
      await Referral.create({
        referrer_id: referred_by,
        referred_user_id: user.id,
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username, email, referral_code: user.referral_code },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = require('uuid').v4();
    const expires_at = new Date(Date.now() + 3600000); // 1 hour

    await ResetToken.create({
      user_id: user.id,
      token,
      expires_at,
    });

    const resetLink = `https://yourdomain.com/reset-password?token=${token}`;
    console.log(`Reset link: ${resetLink}`); // Replace with email service like Nodemailer

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, new_password } = req.body;

  try {
    const resetToken = await ResetToken.findOne({ where: { token } });
    if (!resetToken || resetToken.expires_at < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    await User.update({ password_hash }, { where: { id: resetToken.user_id } });
    await resetToken.destroy();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};