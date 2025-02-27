const UserModel = require("../models/user");
const ReferralModel = require("../models/referral");

const sequelize = require('../config/database'); // Your Sequelize instance
const User = UserModel(sequelize);
const Referral = ReferralModel(sequelize);

exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;
    const referrals = await Referral.findAll({
      where: { referrer_id: userId },
      include: [{ model: User, as: 'ReferredUser', attributes: ['username', 'created_at'] }],
    });

    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getReferralStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Referral.count({ where: { referrer_id: userId } });

    res.json({ successfulReferrals: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};