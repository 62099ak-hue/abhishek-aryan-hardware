const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 1. Path module include kiya
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const Booking = require('./models/Booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Static files (index.html, style.css, script.js, images) serve karne ke liye:
app.use(express.static(path.join(__dirname)));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Database'))
    .catch((err) => console.error('❌ Database Connection Error:', err));

// 3. Home Route (Jab localhost:5000 khologe toh index.html khulegi)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// PRODUCTS, ORDERS & BOOKINGS APIs
// ==========================================

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart cannot be empty" });
        }

        const newOrder = new Order({
            customerName, customerPhone, customerAddress, items, totalAmount
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: savedOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const { name, phone, issue } = req.body;
        const newBooking = new Booking({ name, phone, issue });
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: "Booking received successfully!", booking: savedBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});