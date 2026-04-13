const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// This pulls the key from your Render Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });
        
    } catch (error) {
        // This will print the REAL error in your Render Logs
        console.error("DETAILED ERROR:", error.message);
        res.status(500).json({ error: "The brain is offline.", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));