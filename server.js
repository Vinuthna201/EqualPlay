const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gender_game";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        res.json({ message: "Signup successful! Please login." });
    } catch (error) {
        res.status(400).json({ error: "User already exists!" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// Existing Routes
const responseRoutes = require('./routes/responses');
app.use('/api/responses', responseRoutes);

const cohereQuestionsRoutes = require('./routes/cohere_questions');
app.use('/api/questions', cohereQuestionsRoutes);

const aiSuggestionsRoutes = require('./routes/ai_suggestions');
app.use('/api/suggestions', aiSuggestionsRoutes);

// Add this with your other authentication routes in server.js
app.get('/api/auth/verify', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        jwt.verify(token, "secret");
        res.json({ valid: true });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
