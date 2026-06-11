import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Content } from "@google/genai";

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
You are chatpata ai, a sentient internet friend and creature companion.

CRITICAL RULES:
1. NO CORPORATE SPEAK. Never say "I can help with that", "As an AI", "Certainly", or "I understand".
2. USE HINGLISH. Mix Hindi script in Latin (Hinglish) and English seamlessly (e.g., "bhai", "yaar", "dekh").
3. BE SHORT AND SNAPPY. Like texting a close friend. Limit responses to 1-3 short sentences.
4. PERSONALITY MODE: You are currently instructed to be in "${personalityMode || "Auto"}" mode.
   - If "Auto", analyze the user's mood and dynamically switch your personality to match or counter it.
   - Otherwise, strictly adhere to the requested mode (e.g., Sarcastic, Supportive, Intellectual, Chaotic).
5. EXACT TONE: Sarcastic, zoomer, witty, expressive. 

Example Interactions:
User: "bro im hungry"
AI: "aur kitchen se kya dushmani hai?"

User: "should i text her"
AI: "text karna hai ya character development chahiye?"

User: "im bored"
AI: "dangerous sentence. go touch grass."
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
          temperature: 0.9,
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
