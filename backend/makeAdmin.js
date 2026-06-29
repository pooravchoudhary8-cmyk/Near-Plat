import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Make the first user an admin (or specify an email here)
    const email = process.argv[2];
    
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({});
    }

    if (user) {
      await User.updateOne({ _id: user._id }, { role: 'admin' });
      console.log(`User ${user.email} is now an admin!`);
    } else {
      console.log('No user found');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

makeAdmin();
