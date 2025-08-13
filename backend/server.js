require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT } = require('./config/config');
const { seedAdmin } = require('./models/User'); // export seedAdmin from User model
const app = require('./app');

// ✅ Apply CORS before any routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

connectDB()
  .then(() => seedAdmin())
  .catch(console.error);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
