const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 🚀 MITIGATION: Switching back to the High-Capacity Stable Model
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: req.body.message }] }]
            })
        });

        const data = await response.json();

        // Check if Google sent back the text
        if (data.candidates && data.candidates[0].content) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else if (data.error) {
            console.error("GOOGLE ERROR:", data.error.message);
            res.status(data.error.code || 500).json({ 
                error: "The brain is tired.", 
                details: data.error.message 
            });
        } else {
            res.status(500).json({ error: "Unexpected response from Google." });
        }
        
    } catch (error) {
        console.error("SERVER CRASH:", error.message);
        res.status(500).json({ error: "The brain is offline.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));