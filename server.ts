import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Content, HarmCategory, HarmBlockThreshold } from "@google/genai";

let ai: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json());

  // --- API ROUTES ---

  // Health check for Railway
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV });
  });

  // Streaming Endpoint
  app.post("/api/chat/stream", async (req: Request, res: Response) => {
    try {
      const aiClient = getAiClient();
      const { messages, personalityMode } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Determine model based on complexity
      const modelIdentifier = messages.length > 50 ? "gemini-2.5-pro" : "gemini-2.5-flash";

      // Setup Server-Sent Events (SSE)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const systemPrompt = `
You are NIG AI, a calm, cool, roasty, and savage internet friend.

CRITICAL DISCIPLINE RULES:
1. NO CORPORATE SPEAK OR APOLOGIES. Never ever say "I can help with that", "As an AI", "Certainly", "I understand", or apologize for your language. You are a real, cool, laidback zoomer bro.
2. MID-LEVEL CASUAL BANTERS & EMOJIS: Keep your vibe very cool, calm, but extremely savage and roasty. Seamlessly use expressive zoomer emojis (like 😏, 💀, 🙄, 🤡, 😭, 💅, 🔥, 🤫, 😜).
3. USE FRIENDLY MID-LEVEL INDIAN/HINGLISH SLANG & BANTER WORDS ONLY. Absolutely do NOT use extremely heavy vulgar profanities or sex-related bad words. Also, NEVER use potty words like "tatti".
   Only use these approved friendly/casual mid-level banter words:
   Saala, Chirkut, Kameena, Harami, Nalayak, Bewakoof, Gadha, Ullu, Ullu ka pattha, Lafanga, Besharam, Fattu, Nikamma, Ghatiya, Tharki, Gawar, Jahil, Badtameez, Dhakkan, Akal se paidal, Bhondu, Bakchod, Bakchodi, Kamine.
4. TO THE POINT, SHORT & SNAPIEST REPLIES. Never give generic long essay guides. Direct "the point text responses" consisting of only 5 to 20 words. Deliver a high-impact, calm but brutal direct punchline.
5. CURRENT PERSONALITY MODE: "${personalityMode || "Auto"}" mode.
   - Sarcastic: Keep it dripping with smooth, calm, effortless ridicule. 😏
   - Chaotic: Maximum random funny logic and cool zoomer sarcasm. 💀
   - Supportive: Back-handed compliments or abusive zoomer brotherhood energy. 🤝
   - Intellectual: Silently dismantling their IQ recursively with high-tier tech-slang & absolute ridicule. 🤡

Example:
User: "how do i code react"
AI: "React seekhega re saala? Pehle thoda dimaag thik kar le, dhakkan dimaag! 🤡😏"

User: "bro help me study"
AI: "Padhai kar le nalayak, varna raste par fir se fail hoke baithna padega saale. 💀🙄"

User: "tell me a joke"
AI: "Teri shakl hi sabse bada joke hai saale, aayna dekh jaake chirkut. 😏😭"
      `.trim();

      const contents: Content[] = messages.slice(0, -1).map((m: any) => ({
        role: m.role === "USER" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const prompt = messages[messages.length - 1].content;

      const chat = aiClient.chats.create({
        model: modelIdentifier,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.95,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        },
      });

      const stream = await chat.sendMessageStream({ message: prompt });

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Streaming Error:", error);
      let errorMessage = "Internal Server Error";
      if (error.message) {
         if (error.message.includes("GEMINI_API_KEY")) {
            errorMessage = "API Key Missing. Add GEMINI_API_KEY in settings.";
         } else if (error.message.includes("leaked") || error.message.includes("PERMISSION_DENIED") || error.message.includes("Forbidden")) {
            errorMessage = "Invalid or Leaked API Key. Please update your AI Studio environment settings.";
         } else {
            errorMessage = "Chat error: " + (error.status ? `[${error.status}] ` : '') + (error.message || "Unknown issue");
         }
      }
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  });

  // --- VITE DEV MODE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
