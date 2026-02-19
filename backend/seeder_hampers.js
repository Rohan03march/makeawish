const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const hampers = [
    {
        name: "The Royal Indulgence Hamper",
        image: "/gift-box.png",
        description: "A majestic collection of our finest truffles, dark chocolate bars, and gold-dusted almonds. Perfect for grand celebrations.",
        category: "Hampers",
        price: 2499,
        countInStock: 10,
        rating: 5,
        numReviews: 12,
        isBestseller: true,
        ingredients: "Dark Chocolate, Almonds, Truffles, Gold Dust"
    },
    {
        name: "Midnight Cravings Box",
        image: "/dark-truffle.png",
        description: "For the true dark chocolate connoisseur. 85% single-origin bars, cocoa nibs, and espresso-infused bonbons.",
        category: "Hampers",
        price: 1899,
        countInStock: 15,
        rating: 4.8,
        numReviews: 8,
        isBestseller: true,
        ingredients: "85% Dark Chocolate, Cocoa Nibs, Espresso"
    },
    {
        name: "Sweet Romance Set",
        image: "/milk-swirl.png",
        description: "Heart-shaped pralines, ruby chocolate bark with dried berries, and a bottle of sparkling grape juice.",
        category: "Hampers",
        price: 1599,
        countInStock: 20,
        rating: 4.9,
        numReviews: 15,
        isBestseller: false,
        ingredients: "Ruby Chocolate, Dried Berries, Pralines"
    },
    {
        name: "Grand Celebration Basket",
        image: "/gift-box.png",
        description: "An ultimate assortment containing every flavor we offer, plus a keepsake wooden box.",
        category: "Hampers",
        price: 4999,
        countInStock: 5,
        rating: 5,
        numReviews: 3,
        isBestseller: false,
        ingredients: "Assorted Chocolates, Wooden Box"
    }
];

const importData = async () => {
    try {
        await connectDB();

        // We need an admin user to assign these products to
        const adminUser = await User.findOne({ isAdmin: true });

        if (!adminUser) {
            console.error("Admin user not found! Please run the main seeder first.");
            process.exit(1);
        }

        const sampleHampers = hampers.map(hamper => {
            return { ...hamper, user: adminUser._id };
        });

        // Insert hampers without deleting existing products
        await Product.insertMany(sampleHampers);

        console.log('Hampers Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
