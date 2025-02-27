const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/referrals', authMiddleware, referralController.getReferrals);
router.get('/referral-stats', authMiddleware, referralController.getReferralStats);

module.exports = router;