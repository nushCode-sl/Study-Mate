const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String },
  content: { type: String, required: true },
  summary: { type: String },   // <-- NEW FIELD
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", NoteSchema);
