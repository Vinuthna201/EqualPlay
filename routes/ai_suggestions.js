const express = require('express');
const router = express.Router();

const suggestions = [
    { category: "Education", idea: "Start an online coding course for girls." },
    { category: "Entrepreneurship", idea: "Launch a women-led handmade crafts store." },
    { category: "Health", idea: "Open a telemedicine platform for women's health awareness." },
    { category: "Rural Development", idea: "Provide vocational training for rural women in stitching & tailoring." },
    { category: "Finance", idea: "Develop a microfinance platform for women entrepreneurs." }
];

// API endpoint to get business suggestions
router.get('/get', (req, res) => {
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    res.json({ success: true, suggestion: randomSuggestion });
});

module.exports = router;