const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('signup_db', 'root', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
});

sequelize.sync();

const saveUser = async ({ name, email, phone, password }) => {
  await User.create({ name, email, phone, password });
};

module.exports = { saveUser };
