const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Disable SQL logging in production
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Optional: test connection only in development
if (process.env.NODE_ENV !== 'production') {
  sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully.'))
    .catch(err => console.error('❌ Database connection failed:', err));
}
module.exports = sequelize;


// DB_NAME=groupchat_db
// DB_USER=root
// DB_PASSWORD=Shashank@12
// DB_HOST=localhost
// PORT=3000
// JWT_SECRET=your_super_secret_jwt_key_2024
// JWT_EXPIRES_IN=24h
