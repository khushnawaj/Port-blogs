// middleware/logger.js
const fs = require('fs');
const morgan = require('morgan');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../../logs/access.log'), 
  { flags: 'a' }
);

module.exports = morgan('combined', { stream: accessLogStream });