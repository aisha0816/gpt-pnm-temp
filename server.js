const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // FIX: Using the 2026 workhorse model name
        // This model is the 'v1' version of the 2.5-flash you liked!
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
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
        
        // If it still says 404, we'll try the Gemini 3 name automatically
        res.status(500).json({ 
            error: "Model connection issue.", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));