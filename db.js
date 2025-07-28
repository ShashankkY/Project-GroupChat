const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;



// DB_NAME=groupchat_db
// DB_USER=root
// DB_PASSWORD=Shashank@12,
// DB_HOST=localhost
// PORT=3000
