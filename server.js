const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({ text: "No message received." });
        }

        // ✅ Correct model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest"
        });

        // ✅ Correct request format (VERY IMPORTANT)
        const result = await model.generateContent({
            contents: [
                {
                    parts: [{ text: userMessage }]
                }
            ]
        });

        const response = await result.response;
        const text = response.text();

        console.log("AI says:", text);

        res.json({ text: text || "No response generated." });

    } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("MESSAGE:", error.message);

        res.status(500).json({
            text: "Server error: " + error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server live on port " + PORT);
});