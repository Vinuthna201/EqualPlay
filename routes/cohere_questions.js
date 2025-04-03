const express = require('express');
const router = express.Router();
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

const characterContexts = {
    boy: "Generate a gender awareness scenario for a male character facing stereotypes. Provide two options where option A challenges gender norms (10 points) and option B reinforces them (0 points). Include detailed feedback for each choice.",
    girl: "Create a gender equality situation for a female character encountering bias. Option A should promote equality (10 points) and option B should accept or reinforce inequality (0 points). Provide explanations for both choices.",
    teacher: "Design a classroom scenario about gender bias that a teacher might face. Option A should demonstrate effective intervention (10 points) and option B should show inadequate response (0 points). Include educational context.",
    parent: "Generate a parenting situation involving gender stereotypes. Option A should model progressive parenting (10 points) and option B should reflect traditional stereotypes (0 points). Add developmental context.",
    activist: "Create a scenario where a gender rights activist faces opposition. Option A should represent progressive action (10 points) while Option B represents passivity (0 points). Provide detailed explanations.",
    athlete: "Design a situation where a female athlete challenges gender discrimination in sports. Option A should encourage fairness (10 points) while Option B reinforces bias (0 points).",
    journalist: "Generate a news-related gender issue where a journalist decides how to report on gender inequality. Option A should promote unbiased storytelling (10 points), Option B should reinforce stereotypes (0 points).",
};

router.get('/generate', async (req, res) => {
    try {
        const { character, language } = req.query;
        
        const prompt = `As a gender awareness expert, create a scenario in ${language} for a ${character}.
        ${characterContexts[character]}
        Format response as JSON exactly like this:
        {
            "question": "the scenario question",
            "options": {
                "A": {"text": "progressive choice", "points": 10, "feedback": "detailed explanation"},
                "B": {"text": "regressive choice", "points": 0, "feedback": "detailed explanation"}
            },
            "context": "background information about this issue"
        }`;

        const response = await cohere.generate({
            model: 'command',
            prompt: prompt,
            maxTokens: 300,
            temperature: 0.7,
        });

        // Extract JSON from response
        const jsonStart = response.generations[0].text.indexOf('{');
        const jsonEnd = response.generations[0].text.lastIndexOf('}') + 1;
        const jsonString = response.generations[0].text.slice(jsonStart, jsonEnd);
        
        const result = JSON.parse(jsonString);
        res.json(result);
    } catch (error) {
        console.error('Cohere AI Error:', error);
        res.status(500).json({ 
            error: "Failed to generate question",
            fallback: true
        });
    }
    const allCharacters = Object.keys(characterContexts);
const randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];

const prompt = `As a gender awareness expert, create a scenario for a ${randomCharacter}.
${characterContexts[randomCharacter]}
Format response as JSON...`;

});

module.exports = router;