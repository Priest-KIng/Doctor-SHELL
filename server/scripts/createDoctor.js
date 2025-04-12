const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if doctor exists
    let doctor = await User.findOne({ username: 'doctor' });
    
    if (!doctor) {
      // Create doctor account
      doctor = new User({
        username: 'doctor',
        name: 'Doctor',
        email: 'doctor@example.com',
        password: 'doctor123',
        role: 'doctor',
        specialization: 'General Medicine'
      });
      await doctor.save();
      console.log('Doctor account created successfully');
    } else {
      console.log('Doctor account already exists');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createDoctor(); 