const mongoose = require('mongoose');

// This schema tracks requests from users who want to be admins
const adminRequestSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store temporarily, hash before moving to User
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const AdminRequest = mongoose.model('AdminRequest', adminRequestSchema);
module.exports = AdminRequest;
