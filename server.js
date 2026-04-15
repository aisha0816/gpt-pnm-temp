const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Helper function to try up to 3 times if Google is busy
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.status !== 503 && response.status !== 429) return response;
        
        console.log(`Google is busy, retrying in ${i + 1} seconds...`);
        await new Promise(res => setTimeout(res, 1500 * (i + 1)));
    }
    return fetch(url, options); // Final try
}

app.post('/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: req.body.message }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "Google is still too busy. Try again in 10 seconds!" });
        }
        
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));