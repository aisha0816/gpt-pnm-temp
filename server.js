const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔑 API KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.post("/chat", async (req, res) => {
    console.log("📩 Incoming:", req.body);

    try {
        const message = req.body.message;

        if (!message) {
            return res.json({ text: "No message received" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest"
        });

        const result = await model.generateContent({
            contents: [
                {
                    parts: [{ text: message }]
                }
            ]
        });

        const response = await result.response;
        const text = response.text();

        console.log("🤖 AI:", text);

        res.json({ text });

    } catch (error) {
        console.error("❌ ERROR:", error.message);

        res.status(500).json({
            text: "ERROR: " + error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});