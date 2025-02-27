const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.register);

router.post('/login', [
  body('identifier').notEmpty().withMessage('Identifier is required'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Invalid email format'),
], authController.forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], authController.resetPassword);

module.exports = router;