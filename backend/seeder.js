const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        // Create Admin User
        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@makeawish.com',
            password: 'adminpassword123',
            isAdmin: true,
            isApproved: true
        });

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser._id };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
