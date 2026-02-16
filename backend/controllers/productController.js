const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, description, image, category, countInStock, rating, ingredients, images, isBestseller } = req.body;

        const product = new Product({
            name: name || 'Sample Name',
            price: price || 0,
            user: req.user._id,
            image: image || '/images/sample.jpg', // Keep main image for backward compatibility
            images: images || [image] || ['/images/sample.jpg'], // Use provided images or fallback to main image
            category: category || 'Sample Category',
            countInStock: countInStock || 0,
            numReviews: 0,
            rating: rating || 0,
            isBestseller: isBestseller || false,
            ingredients: ingredients || '',
            description: description || 'Sample description'
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, price, description, image, category, countInStock, isBestseller } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            if (req.body.rating !== undefined) product.rating = req.body.rating;
            if (req.body.isBestseller !== undefined) product.isBestseller = req.body.isBestseller;
            if (req.body.ingredients !== undefined) product.ingredients = req.body.ingredients;
            if (req.body.images !== undefined) product.images = req.body.images;
            // Ensure main image is updated if images array is updated and valid
            if (req.body.images && req.body.images.length > 0) {
                product.image = req.body.images[0];
            } else if (image) {
                product.image = image;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
};
