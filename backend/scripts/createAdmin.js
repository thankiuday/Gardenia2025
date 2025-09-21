const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user with predefined credentials
    const adminData = {
      username: 'gardencity.university.in',
      passwordHash: 'gardenia@2025' // This will be hashed by the pre-save middleware
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
    console.log('Username: gardencity.university.in');
    console.log('Password: gardenia@2025');
    console.log('Admin credentials are ready for Gardenia 2025!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdmin();
