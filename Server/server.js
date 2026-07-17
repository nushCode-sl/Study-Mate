require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Note = require("./models/Note");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));


// ---------------------------
// GET /api/notes
// ---------------------------
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});


// ---------------------------
// POST /api/notes
// ---------------------------
app.post("/api/notes", async (req, res) => {
  const { title, subject, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  const note = await Note.create({ title, subject, content });
  res.json(note);
});


// ---------------------------
// DELETE /api/notes/:id
// ---------------------------
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  await Note.findByIdAndDelete(id);

  res.json({ message: "Note deleted" });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------------------------
// POST /api/notes/:id/summarize
// ---------------------------
app.post("/api/notes/:id/summarize", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // AI prompt
    const prompt = `
Summarize the following study note in exactly 3 bullet points.
Then create 1 quiz question about the content.

Note:
${note.content}
`;

    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    });

    const aiText = response.content[0].text;

    // Save summary
    note.summary = aiText;
    await note.save();

    res.json(note);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

