import { useEffect, useState } from "react";
import { db, auth } from "../pages/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(collection(db, "notes"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesArray);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    try {
      await addDoc(collection(db, "notes"), {
        uid: auth.currentUser.uid,
        title,
        content,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
    } catch (err) {
      alert("Error adding note: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "notes", id));
    }
  };

  const startEdit = (note) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    if (!editTitle || !editContent) {
      alert("Both fields are required!");
      return;
    }

    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, {
        title: editTitle,
        content: editContent,
      });
      setEditId(null);
    } catch (err) {
      alert("Error updating note: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
      {/* Navbar */}
      <nav className="bg-white/20 backdrop-blur-md p-4 flex justify-between items-center shadow-lg rounded-xl mb-6">
        <h1 className="text-xl font-bold">Your Notes</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-1 bg-green-500 rounded hover:bg-green-600 transition"
        >
          Back to Dashboard
        </button>
      </nav>

      {/* Add Note Form */}
      <form
        onSubmit={handleAddNote}
        className="bg-white/20 p-6 rounded-xl mb-8 shadow-md max-w-xl mx-auto"
      >
        <input
          className="border-none p-3 mb-4 w-full rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border-none p-3 mb-4 w-full rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600 transition w-full"
        >
          Add Note
        </button>
      </form>

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/20 p-4 rounded-xl shadow hover:scale-105 transition-transform"
            >
              {editId === note.id ? (
                <>
                  <input
                    className="border-none p-2 w-full mb-2 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border-none p-2 w-full mb-2 rounded bg-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button
                    onClick={() => handleUpdate(note.id)}
                    className="bg-green-500 px-4 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-500 px-4 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{note.content}</p>
                  <button
                    onClick={() => startEdit(note)}
                    className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 opacity-80">
            No notes yet. Start adding some!
          </p>
        )}
      </div>
    </div>
  );
}
