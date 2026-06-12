import "../config.js";
import express from "express";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.VITE_GEMINI_API_KEY;

// Middleware — protect chat route
const authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

router.use(authenticate);

// POST /api/chat
// Body: { conversation_id, message, model_id }
router.post("/", async (req, res) => {
  const { conversation_id, message, model_id } = req.body;

  if (!message?.trim())
    return res.status(400).json({ error: "Message is required." });

  try {
    let convId = conversation_id;

    // If no conversation_id, create a new conversation automatically
    if (!convId) {
      const result = db
        .prepare(
          `
        INSERT INTO conversations (user_id, title, model_id)
        VALUES (?, ?, ?)
      `,
        )
        .run(
          req.user.id,
          message.slice(0, 40) + (message.length > 40 ? "..." : ""),
          model_id || "gemini-2.5-flash",
        );
      convId = result.lastInsertRowid;
    } else {
      // Verify conversation belongs to this user
      const conversation = db
        .prepare(
          `
        SELECT * FROM conversations WHERE id = ? AND user_id = ?
      `,
        )
        .get(convId, req.user.id);

      if (!conversation)
        return res.status(404).json({ error: "Conversation not found." });
    }

    // Save user message to DB
    db.prepare(
      `
      INSERT INTO messages (conversation_id, role, text)
      VALUES (?, 'user', ?)
    `,
    ).run(convId, message);

    // Load full conversation history for context
    const history = db
      .prepare(
        `
      SELECT role, text FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `,
      )
      .all(convId);

    // Build Gemini history (exclude the last message — that's the current input)
    const geminiHistory = history.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Call Gemini API
    if (!API_KEY) throw new Error("API Key not configured on server.");

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: model_id || "gemini-2.5-flash",
    });

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Save model response to DB
    db.prepare(
      `
      INSERT INTO messages (conversation_id, role, text)
      VALUES (?, 'model', ?)
    `,
    ).run(convId, responseText);

    res.json({
      conversation_id: convId,
      reply: responseText,
    });
  } catch (err) {
    console.error("Chat error:", err);

    let errorMessage = "An error occurred.";
    if (err.message.includes("404"))
      errorMessage = "Model not found. Check your model ID.";
    else if (err.message.includes("API Key"))
      errorMessage = "API Key missing or invalid on server.";

    res.status(500).json({ error: errorMessage });
  }
});

export default router;
