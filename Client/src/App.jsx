import { useEffect, useState } from "react";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch notes from API
  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch("http://localhost:3000/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  // Add note
  async function addNote(note) {
    const res = await fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });

    const newNote = await res.json();
    setNotes([...notes, newNote]);
  }

  // Delete note
  async function deleteNote(id) {
    await fetch(`http://localhost:3000/api/notes/${id}`, {
      method: "DELETE",
    });

    setNotes(notes.filter((n) => n.id !== id));
  }

  // Filter notes
  const filteredNotes = notes.filter((n) =>
    `${n.title} ${n.subject}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>StudyMate Notes</h1>

      <input
        type="text"
        placeholder="Search notes..."
        className="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <NoteForm onAdd={addNote} />

      {loading && <p>Loading notes...</p>}

      {!loading && filteredNotes.length === 0 && (
        <p>No notes yet — add your first one!</p>
      )}

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
}

export default App;
