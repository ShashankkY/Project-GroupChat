const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const GroupUser = sequelize.define('GroupUser', {
  // Sequelize automatically manages groupId and userId as FKs
}, { timestamps: false });

module.exports = GroupUser;
