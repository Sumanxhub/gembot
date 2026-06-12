import "../config.js";
import express from "express";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware — protect all conversation routes
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

// GET /api/conversations — get all conversations for logged-in user
router.get("/", (req, res) => {
  try {
    const conversations = db
      .prepare(
        `
      SELECT * FROM conversations 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `,
      )
      .all(req.user.id);

    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/conversations — create a new conversation
router.post("/", (req, res) => {
  const { title, model_id } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO conversations (user_id, title, model_id) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(
      req.user.id,
      title || "New Chat",
      model_id || "gemini-2.5-flash",
    );

    const conversation = db
      .prepare("SELECT * FROM conversations WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({ conversation });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/conversations/:id — get a conversation with its messages
router.get("/:id", (req, res) => {
  try {
    const conversation = db
      .prepare(
        `
      SELECT * FROM conversations WHERE id = ? AND user_id = ?
    `,
      )
      .get(req.params.id, req.user.id);

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found." });

    const messages = db
      .prepare(
        `
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `,
      )
      .all(conversation.id);

    res.json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// PATCH /api/conversations/:id — rename a conversation
router.patch("/:id", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required." });

  try {
    const conversation = db
      .prepare(
        `
      SELECT * FROM conversations WHERE id = ? AND user_id = ?
    `,
      )
      .get(req.params.id, req.user.id);

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found." });

    db.prepare("UPDATE conversations SET title = ? WHERE id = ?").run(
      title,
      req.params.id,
    );

    res.json({ message: "Conversation renamed." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/conversations/:id — delete a conversation
router.delete("/:id", (req, res) => {
  try {
    const conversation = db
      .prepare(
        `
      SELECT * FROM conversations WHERE id = ? AND user_id = ?
    `,
      )
      .get(req.params.id, req.user.id);

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found." });

    db.prepare("DELETE FROM conversations WHERE id = ?").run(req.params.id);

    res.json({ message: "Conversation deleted." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
