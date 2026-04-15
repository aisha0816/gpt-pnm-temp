const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 🚀 THE FIX: Use v1beta and gemini-2.5-flash
    // This is the model that worked for us a few minutes ago!
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
            // This will show us if it's a Quota (429) or another 404
            console.error("GOOGLE ERROR:", data.error.message);
            res.status(data.error.code || 500).json({ 
                error: "Google Error", 
                details: data.error.message 
            });
        } else {
            res.status(500).json({ error: "No response from AI." });
        }
        
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ error: "Server crashed.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));