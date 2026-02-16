const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const fs = require('fs');

const inspectProducts = async () => {
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products. Writing to products_dump.txt...`);

        const output = products.map(p => `ID: ${p._id} | Name: ${p.name} | Image: ${p.image}`).join('\n');
        fs.writeFileSync('products_dump.txt', output);

        console.log('Done.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectProducts();
