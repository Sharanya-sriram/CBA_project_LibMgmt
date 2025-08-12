import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import context
import API from "../api/http-common"; // adjust path if needed

export default function IssuedBooksList() {
  const { darkMode } = useAuth(); // Access darkMode from context

  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssuedBooks = async () => {
    try {
      const res = await API.getIssuedBooks();
      setIssuedBooks(res.data);
    } catch (err) {
      console.error("Error fetching issued books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this issued book record?")) return;
    try {
      await API.deleteIssuedBook(id);
      setIssuedBooks((prev) =>
        prev.filter((book) => book.issuedBookId !== id)
      );
    } catch (err) {
      console.error("Error deleting issued book:", err);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  // Theme-based classes
  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const tableHeaderClass = darkMode ? "bg-gray-800" : "bg-gray-300";
  const tableRowClass = darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-300";

  return (
    <div className={`p-6 min-h-screen ${bgClass}`}>
      <h2 className="text-2xl font-bold mb-4">📦 Issued Books</h2>

      {loading ? (
        <p>Loading issued books...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full border ${borderClass}`}>
            <thead>
              <tr className={`${tableHeaderClass} text-left`}>
                <th className="p-3">BookId</th>
                <th className="p-3">Book Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Borrower</th>
                <th className="p-3">BorrowerId</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Return Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((ib) => (
                <tr
                  key={ib.issuedBookId}
                  className={`${tableRowClass} transition`}
                >
                  <td className="p-3">{ib.bookId}</td>
                  <td className="p-3">{ib.title}</td>
                  <td className="p-3">{ib.author}</td>
                  <td className="p-3">{ib.userName}</td>
                  <td className="p-3">{ib.userId}</td>
                  <td className="p-3">{ib.issueDate?.split("T")[0]}</td>
                  <td className="p-3">
                    {ib.returnDate?.split("T")[0] || "Not Returned"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(ib.issuedBookId)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {issuedBooks.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-400">
                    No issued books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
