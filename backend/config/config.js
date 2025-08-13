// config/config.js
require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb',
  JWT_SECRET: process.env.JWT_SECRET || 'please_change_this_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
