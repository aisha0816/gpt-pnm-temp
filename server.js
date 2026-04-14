const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Initialize the API with your key from Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // USE THIS EXACT NAME: gemini-2.5-flash
        // This is the stable 2026 workhorse you wanted!
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        if (text) {
            res.json({ text: text });
        } else {
            res.status(500).json({ error: "Empty response from the AI." });
        }
        
    } catch (error) {
        console.error("SERVER ERROR:", error.message);

        // This checks if Google is just busy (503/429) or if the model is wrong (404)
        if (error.message.includes("404")) {
            res.status(404).json({ 
                error: "Model not found.", 
                details: "Google renamed the model. Try 'gemini-2.5-flash' in server.js." 
            });
        } else {
            res.status(500).json({ 
                error: "The brain is offline.", 
                details: error.message 
            });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));