const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const http = require('http');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = ["http://localhost:3000", "https://mymakeawish.vercel.app"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// Basic Route
app.get('/', (req, res) => {
    res.send('MakeAWish API is running...');
});

// Routes will be imported here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


app.get('/api/config/razorpay', (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
