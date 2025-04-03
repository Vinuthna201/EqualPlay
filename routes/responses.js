const express = require('express');
const router = express.Router();
const UserResponse = require('../models/UserResponse');

router.post('/save', async (req, res) => {
    try {
        const { username, choice, score } = req.body;
        const newResponse = new UserResponse({ username, choice, score });
        await newResponse.save();
        res.json({ message: "Game progress saved!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving data" });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const topScores = await UserResponse.aggregate([
            { 
                $group: { 
                    _id: "$username", 
                    score: { $max: "$score" }
                } 
            },
            { $sort: { score: -1 } },
            { $limit: 5 }
        ]);
        
        res.json(topScores.map(item => ({ username: item._id, score: item.score })));
    } catch (error) {
        res.status(500).json({ error: "Error fetching leaderboard" });
    }
});

module.exports = router;