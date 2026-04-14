const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛠️ HELPER FUNCTION: This waits and retries if Google is busy
async function generateWithRetry(model, message, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            // If it's a 503 (Busy) or 429 (Quota), wait and try again
            if (error.message.includes("503") || error.message.includes("429")) {
                console.log(`Google is busy. Retry attempt ${i + 1}...`);
                await new Promise(res => setTimeout(res, 2000 * (i + 1))); // Wait 2s, 4s, 6s...
            } else {
                throw error; // If it's a different error, stop immediately
            }
        }
    }
    throw new Error("Google is still overloaded after 3 tries.");
}

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // 🚀 Call our new retry function
        const text = await generateWithRetry(model, req.body.message);

        res.json({ text: text });
        
    } catch (error) {
        console.error("FINAL ERROR:", error.message);
        res.status(500).json({ 
            error: "The brain is overloaded.", 
            details: "Google's 2.5-flash is at max capacity. Try again in 30 seconds!" 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));