const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/gemini-chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    // Example mock response (replace with real Gemini API call)
    const response = `Gemini AI Response to: "${userMessage}"`;

    res.json({ response });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Gemini chat failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
