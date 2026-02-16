const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        // Decrement countInStock
        if (createdOrder) {
            for (const item of orderItems) {
                if (item.product) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.countInStock = product.countInStock - item.qty;
                        await product.save();
                    }
                }
            }
        }

        if (createdOrder) {
            // Emit socket event
            const io = req.app.get('io');
            io.emit('order_update', { type: 'create', order: createdOrder });
        }

        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();

        req.app.get('io').emit('order_update', { type: 'update', order: updatedOrder });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';

        const updatedOrder = await order.save();

        req.app.get('io').emit('order_update', { type: 'update', order: updatedOrder });

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();
        req.app.get('io').emit('order_update', { type: 'update', order: updatedOrder });
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to cancel this order' });
            }

            // Allow cancellation ONLY if status is 'Placed'
            if (order.status !== 'Placed') {
                return res.status(400).json({ message: 'Cannot cancel order that has already been processed' });
            }

            order.status = 'Cancelled';
            // Also reset flags to be consistent
            order.isDelivered = false;

            const updatedOrder = await order.save();
            req.app.get('io').emit('order_update', { type: 'update', order: updatedOrder });
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
    const { amount } = req.body;

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
        amount: Math.round(amount * 100), // amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Restock items before deleting
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock += item.qty;
                await product.save();
            }
        }

        await order.deleteOne();
        req.app.get('io').emit('order_update', { type: 'delete', id: req.params.id });
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    createRazorpayOrder,
    deleteOrder
};
