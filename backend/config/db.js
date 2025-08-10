const mongoose = require('mongoose');
const { MONGO_URI  } = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI); // Removed deprecated options
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;