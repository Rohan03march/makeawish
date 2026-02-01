const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const checkPending = async () => {
    try {
        const users = await User.find({ isApproved: false });
        console.log(`Found ${users.length} pending users:`);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) [Admin: ${u.isAdmin}]`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkPending();
