const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure to run: npm install node-fetch@2
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    // Using the 2.5-flash URL directly
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: req.body.message }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else if (data.error) {
            // If Google says 429 or 503, we pass that info back
            res.status(data.error.code || 500).json({ 
                error: "Google is struggling.", 
                details: data.error.message 
            });
        } else {
            res.status(500).json({ error: "Unexpected response format from Google." });
        }
        
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ error: "The brain is offline.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));