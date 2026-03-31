const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Lets your website talk to this server
app.use(express.json());

// This looks for the key in the "Vault" (Environment Variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(req.body.message);
        res.json({ text: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: "The mentor is offline." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));