require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await connectDB();
    const adminEmail = 'admin@khush.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        email: adminEmail,
        password: 'securedAdmin',
        role: 'admin',
        isVerified: true,
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
