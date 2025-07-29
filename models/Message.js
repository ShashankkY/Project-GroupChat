const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// One-to-Many: User has many Messages
User.hasMany(Message);
Message.belongsTo(User); // Message.userId

module.exports = Message;
