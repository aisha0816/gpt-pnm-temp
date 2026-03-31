const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Initialize the Gemini AI with your Secret Key from the Render Vault
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // This line waits for Google to finish thinking
        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        const text = response.text();

        // This sends the actual words back to your blue chat box
        res.json({ text: text });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "The mentor is offline." });
    }
});

// Use Render's port or 3000 for local testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));