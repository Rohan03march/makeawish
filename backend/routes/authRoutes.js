const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getPendingUsers,
    updateUserStatus,
    getAllUsers,
    getFavorites,
    toggleFavorite,
    getUserProfile,
    updateUserProfile,
    updateUserCart
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/cart').put(protect, updateUserCart);

// Admin Flows
router.get('/pending-users', protect, admin, getPendingUsers);
router.get('/users', protect, admin, getAllUsers);
router.put('/approve-user/:id', protect, admin, updateUserStatus);

// User Features
router.get('/favorites', protect, getFavorites);
router.put('/favorites/:id', protect, toggleFavorite);

module.exports = router;
