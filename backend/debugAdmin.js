const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const debugAdmin = async () => {
    try {
        const email = 'admin@makeawish.com';
        const password = 'adminpassword123';

        console.log(`Checking user: ${email}...`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found in database!');
        } else {
            console.log('✅ User found:', user.name);
            console.log('   ID:', user._id);
            console.log('   isAdmin:', user.isAdmin);
            console.log('   isApproved:', user.isApproved);
            console.log('   Stored Hash:', user.password);

            const isMatch = await user.matchPassword(password);
            if (isMatch) {
                console.log('✅ Password Match: SUCCESS');
            } else {
                console.log('❌ Password Match: FAILED');
                console.log('   The stored hash does not match "adminpassword123".');
            }
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugAdmin();
