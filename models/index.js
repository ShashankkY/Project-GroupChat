const sequelize = require('../db'); // Make sure this points to db.js
const User = require('./User');
const Message = require('./Message');
const Group = require('./Group');
const GroupUser = require('./GroupUser');

// ✅ Associations
User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

// Optional: sync association models here if needed
// sequelize.sync({ alter: true });  // Be careful in production!

module.exports = {
  sequelize,
  User,
  Message,
  Group,
  GroupUser
};
