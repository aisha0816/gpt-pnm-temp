const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Initialize the Gemini AI using your Render Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // Using 1.5-flash: It has the best free-tier stability (15 requests/min)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        // If the AI actually responded, send the text
        if (text) {
            res.json({ text: text });
        } else {
            res.status(500).json({ error: "Empty response from AI." });
        }
        
    } catch (error) {
        console.error("SERVER ERROR:", error.message);

        // Handle the Quota Error (429) gracefully
        if (error.message.includes("429")) {
            res.status(429).json({ 
                error: "Google is resting.", 
                details: "The free tier limit was reached. Please wait 60 seconds and try again!" 
            });
        } else {
            res.status(500).json({ 
                error: "The brain is offline.", 
                details: error.message 
            });
        }
    }
});

// Use Render's assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));