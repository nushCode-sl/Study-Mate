function NoteCard({ note, onDelete }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p><strong>{note.subject}</strong></p>
      <p>{note.content}</p>

      <button className="delete-btn" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  );
}

export default NoteCard;
