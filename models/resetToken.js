const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResetToken = sequelize.define('ResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    indexes: [
      { fields: ['token'] },
    ],
  });

  return ResetToken;
};