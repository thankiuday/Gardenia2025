const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminData = {
      username: 'admin',
      passwordHash: 'admin123' // This will be hashed by the pre-save middleware
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin
    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin user created successfully:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdmin();
