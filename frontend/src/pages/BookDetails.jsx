// src/pages/BookDetails.jsx
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/http-common";
import { useState, useEffect } from "react";

const BookDetails = () => {
  const { id } = useParams();
  const { darkMode, user } = useAuth();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.getBook(id);
        setBook(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch book:", err);
      }
    };
    fetchBook();
  }, [id]);

  const handleIssue = async (copyId) => {
    try {
      const newIssue = {
        userId: user.id,
        bookId: parseInt(id),
        copyId,
        issueDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        returnDate: null
      };
      
      console.log("Issuing book:", newIssue);
      await api.addIssuedBook(newIssue);
      alert(`✅ Book copy ${copyId} issued successfully!`);

      // Update local state so button becomes disabled
      setBook((prev) => ({
        ...prev,
        copies: prev.copies.map((c) =>
          c.copyId === copyId ? { ...c, available: false } : c
        ),
      }));
    } catch (err) {
      console.error("❌ Failed to issue book:", err);
      alert("Failed to issue book. Please try again.");
    }
  };

  if (!book) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        <p className="text-lg">Book not found.</p>
      </div>
    );
  }

  const bgClass = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-gray-100" : "text-gray-800";
  const subTextClass = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Book Info */}
      <div className={`${bgClass} max-w-2xl mx-auto rounded-xl shadow-lg p-6 mb-8`}>
        <h1 className={`text-3xl font-bold mb-4 ${textClass}`}>{book.title}</h1>
        <p className={`mb-2 ${subTextClass}`}><strong>Author:</strong> {book.author}</p>
        <p className={`mb-2 ${subTextClass}`}><strong>Genre:</strong> {book.genre}</p>
        <p className={`mb-2 ${subTextClass}`}><strong>Publication Date:</strong> {book.publicationDate}</p>
        <p className={subTextClass}>
          <strong>Description:</strong> {book.description || "No description available."}
        </p>
      </div>

      {/* Copies Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {book.copies?.map((copy) => (
          <div
            key={copy.copyId}
            className={`${bgClass} rounded-xl shadow-lg p-4 flex flex-col justify-between`}
          >
            <div>
              <p className={`mb-1 ${textClass}`}><strong>Copy ID:</strong> {copy.copyId}</p>
              <p
                className={`mb-3 font-bold ${
                  copy.available
                    ? darkMode ? "text-green-300" : "text-green-700"
                    : darkMode ? "text-red-300" : "text-red-700"
                }`}
              >
                {copy.available ? "Available" : "Issued"}
              </p>
            </div>
            <button
              onClick={() => handleIssue(copy.copyId)}
              disabled={!copy.available}
              className={`mt-auto px-4 py-2 rounded-lg font-semibold transition ${
                copy.available
                  ? darkMode
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {copy.available ? "Get Issued" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
