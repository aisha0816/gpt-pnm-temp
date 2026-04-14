const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// FORCE the version to v1 (Stable) instead of v1beta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // We use the most basic model name to avoid the 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        if (text) {
            res.json({ text: text });
        } else {
            res.status(500).json({ error: "Empty response from AI." });
        }
        
    } catch (error) {
        console.error("SERVER ERROR:", error.message);
        res.status(500).json({ 
            error: "The brain is offline.", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));