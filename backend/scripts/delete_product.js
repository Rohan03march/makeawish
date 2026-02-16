const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const deleteProduct = async () => {
    try {
        // ID of Royce Chocolate
        const id = '697f39f36847779c9bf29435';

        const product = await Product.findById(id);
        if (product) {
            await Product.deleteOne({ _id: id });
            console.log(`Deleted product: ${product.name}`);
        } else {
            console.log('Product not found.');
        }

        // Also delete the pinimg one just in case 
        const id2 = '699370c1c9e5b12ffbe0ae10';
        const product2 = await Product.findById(id2);
        if (product2) {
            await Product.deleteOne({ _id: id2 });
            console.log(`Deleted product: ${product2.name}`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

deleteProduct();
