const mongoose = require('mongoose');

const UserResponseSchema = new mongoose.Schema({
    username: String,
    choice: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserResponse', UserResponseSchema);