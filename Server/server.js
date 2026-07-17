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
