const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const referralRoutes = require('./routes/referralRoutes');
const sequelize = require('./config/database');
const User = require('./models/user')(sequelize);
const Referral = require('./models/referral')(sequelize);
const ResetToken = require('./models/resetToken')(sequelize);

// Middleware
app.use(express.json());

// Associations
User.belongsTo(User, { as: 'Referrer', foreignKey: 'referred_by' });
User.hasMany(User, { as: 'ReferredUsers', foreignKey: 'referred_by' });
User.hasMany(Referral, { as: 'ReferralsMade', foreignKey: 'referrer_id' });
Referral.belongsTo(User, { as: 'Referrer', foreignKey: 'referrer_id' });
Referral.belongsTo(User, { as: 'ReferredUser', foreignKey: 'referred_user_id' });
ResetToken.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(ResetToken, { foreignKey: 'user_id' });

// Routes
app.use('/api', authRoutes);
app.use('/api', referralRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});