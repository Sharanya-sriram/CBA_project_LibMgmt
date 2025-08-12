import React, { useState, useEffect, useContext } from "react";
import api from "../api/http-common"; // your API file
import { AuthContext } from "../context/AuthContext";

export default function BookList() {
  const { darkMode } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    publicationDate: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch books:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.updateBook(`${editId}`, formData);
        alert("✅ Book updated!");
      } else {
        await api.post("/books", formData);
        alert("✅ Book added!");
      }
      setShowForm(false);
      setEditId(null);
      setFormData({
        title: "",
        author: "",
        genre: "",
        publicationDate: "",
        description: "",
      });
      fetchBooks();
    } catch (err) {
      console.error("❌ Failed to save book:", err);
    }
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publicationDate: book.publicationDate.split("T")[0],
      description: book.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.deleteBook(`${id}`);
      alert("🗑️ Book deleted!");
      fetchBooks();
    } catch (err) {
      console.error("❌ Failed to delete book:", err);
    }
  };

  // Theme classes based on darkMode
  const bgColor = darkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const tableBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300";
  const tableHover = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const inputBg = darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black";

  return (
    <div className={`p-6 min-h-screen ${bgColor}`}>
      <h2 className="text-2xl font-bold mb-4">📚 Books</h2>

      {!showForm && (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="mb-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          >
            ➕ Add New Book
          </button>

          <div className="overflow-x-auto">
            <table className={`w-full border-collapse border ${borderColor}`}>
              <thead>
                <tr className={tableBg}>
                  <th className={`border ${borderColor} p-2`}>Title</th>
                  <th className={`border ${borderColor} p-2`}>Author</th>
                  <th className={`border ${borderColor} p-2`}>Genre</th>
                  <th className={`border ${borderColor} p-2`}>Publication Date</th>
                  <th className={`border ${borderColor} p-2`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className={`${tableBg} ${tableHover} transition`}
                  >
                    <td className={`border ${borderColor} p-2`}>{book.title}</td>
                    <td className={`border ${borderColor} p-2`}>{book.author}</td>
                    <td className={`border ${borderColor} p-2`}>{book.genre}</td>
                    <td className={`border ${borderColor} p-2`}>
                      {book.publicationDate.split("T")[0]}
                    </td>
                    <td className={`border ${borderColor} p-2 flex gap-2`}>
                      <button
                        onClick={() => handleEdit(book)}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className={`${tableBg} p-4 rounded shadow-lg`}
        >
          <h3 className="text-xl mb-4">
            {editId ? "✏️ Edit Book" : "➕ Add New Book"}
          </h3>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full mb-2 p-2 rounded ${inputBg}`}
            required
          />
          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className={`w-full mb-2 p-2 rounded ${inputBg}`}
            required
          />
          <input
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            className={`w-full mb-2 p-2 rounded ${inputBg}`}
            required
          />
          <input
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            className={`w-full mb-2 p-2 rounded ${inputBg}`}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full mb-2 p-2 rounded ${inputBg}`}
            rows="3"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              {editId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
