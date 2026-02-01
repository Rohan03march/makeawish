const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isApproved) {
            return res.status(401).json({ message: 'Account pending approval. Contact Admin.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            message: "Login successful"
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, isAdminRequest } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Auto-approve customers, but require approval for admin requests
    const isApproved = isAdminRequest ? false : true;

    const user = await User.create({
        name,
        email,
        password,
        isAdmin: false, // Always false initially
        isApproved
    });

    if (user) {
        if (isAdminRequest) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                message: "Account created. Please contact admin for approval."
            });
        } else {
            // Auto-login for customers
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: "Registration successful"
            });
        }
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all pending users
// @route   GET /api/auth/pending-users
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
    const users = await User.find({ isApproved: false }).select('-password');
    res.json(users);
};

// @desc    Approve or Reject User
// @route   PUT /api/auth/approve-user/:id
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.action === 'approve') {
            user.isApproved = true;
            if (req.body.makeAdmin) {
                user.isAdmin = true;
            }
            await user.save();
            res.json({ message: 'User approved successfully' });
        } else if (req.body.action === 'reject') {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User rejected and removed' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (error) {
        console.error("Update User Status Error:", error);
        res.status(500).json({ message: error.message });
    }

};

// @desc    Get all users (customers)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $match: { isAdmin: false }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'orders'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    createdAt: 1,
                    isApproved: 1,
                    isAdmin: 1,
                    orderCount: { $size: '$orders' },
                    totalSpent: { $sum: '$orders.totalPrice' }
                }
            }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user favorites
// @route   GET /api/auth/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle favorite product
// @route   PUT /api/auth/favorites/:id
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.id;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favorites.includes(productId);

        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id.toString() !== productId);
            await user.save();
            res.json({ message: 'Removed from favorites', favorites: user.favorites });
        } else {
            user.favorites.push(productId);
            await user.save();
            res.json({ message: 'Added to favorites', favorites: user.favorites });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            addresses: user.addresses || []
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.body.addresses) {
            user.addresses = req.body.addresses;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            addresses: updatedUser.addresses,
            token: generateToken(updatedUser._id),
            message: "Profile updated successfully"
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    authUser,
    registerUser,
    getPendingUsers,
    updateUserStatus,
    getAllUsers,
    getFavorites,
    toggleFavorite,
    getUserProfile,
    updateUserProfile
};
