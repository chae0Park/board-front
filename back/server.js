const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const User = require('./model/User'); // User 모델 임포트

//const users = []; // Temporary storage for user data
const JWT_SECRET = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/your_db_name', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
    //const { name, email, password } = req.body;
    const {email, password, nickname, telNumber, address, addressDetail, agreedPersonal } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    const existingTelNum = await User.findOne({ telNumber });
    if (existingUser || existingTelNum) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, nickname, telNumber, address, addressDetail, agreedPersonal });
   
    await newUser.save(); // MongoDB에 사용자 저장

    res.status(201).json({ message: 'Registration successful' });
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { nickname: user.nickname, email: user.email } });
});

// Middleware to check for token (for protected routes)
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Protected Route for Logout (or other secured actions)
app.post('/api/logout', authenticateToken, (req, res) => {
    // Clear token logic could be handled on client side.
    res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
