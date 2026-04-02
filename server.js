const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        console.log("📩 Incoming:", userMessage);

        if (!userMessage) {
            return res.json({ text: "No message received." });
        }

        // ✅ WORKING MODEL (your confirmed one)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        // ✅ Correct request format
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ]
        });

        const response = await result.response;
        const text = response.text();

        console.log("🤖 AI:", text);

        res.json({
            text: text || "No response generated."
        });

    } catch (error) {
        console.error("❌ ERROR:", error.message);

        res.status(500).json({
            text: "Server error: " + error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(🚀 Server live on port ${PORT});
});