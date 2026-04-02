const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // ✅ FIXED MODEL NAME
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" 
        });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        console.log("AI says:", text);

        if (!text) {
            res.json({ text: "I'm here, but I have no words. Try again?" });
        } else {
            res.json({ text: text });
        }
        
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ text: "The brain is offline. Check your API key in Render!" });
    }
});

const PORT = process.env.PORT || 3000;

// ✅ FIXED BACKTICKS HERE
app.listen(PORT, function () {
    console.log("Server live on port " + PORT);
});