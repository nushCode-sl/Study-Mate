import { useState } from "react";

function NoteCard({ note, onDelete, onSummarize }) {
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    setLoading(true);
    await onSummarize(note.id);
    setLoading(false);
  }

  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p><strong>{note.subject}</strong></p>
      <p>{note.content}</p>

      {note.summary && (
        <div className="summary-box">
          <h4>Summary</h4>
          <p>{note.summary}</p>
        </div>
      )}

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      <button className="delete-btn" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  );
}

export default NoteCard;
