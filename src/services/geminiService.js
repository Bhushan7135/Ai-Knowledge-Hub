// src/services/geminiService.js
export const sendToGemini = async (userMessage) => {
    try {
      const res = await fetch("http://localhost:5000/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
      });
  
      if (!res.ok) throw new Error("Failed to connect to Gemini API");
  
      const data = await res.json();
      return data.response;
    } catch (err) {
      console.error("Gemini API error:", err);
      return "Error: Unable to get response from Gemini.";
    }
  };
  