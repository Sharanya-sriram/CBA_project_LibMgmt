// src/pages/BookDetails.jsx
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/http-common";
import { useState, useEffect } from "react";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
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
      console.log(user);
      const newIssue = {
        userId: user.id,
        bookId: id,
        copyId,
        issueDate: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
        returnDate: null,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <p className="text-lg">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100 dark:bg-gray-900">
      {/* Book Info */}
      <div className="bg-white dark:bg-gray-800 max-w-2xl mx-auto rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {book.title}
        </h1>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          <strong>Genre:</strong> {book.genre}
        </p>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          <strong>Publication Date:</strong> {book.publicationDate}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Description:</strong>{" "}
          {book.description || "No description available."}
        </p>
      </div>

      {/* Copies Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {book.copies?.map((copy) => (
          <div
            key={copy.copyId}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col justify-between"
          >
            <div>
              <p className="mb-1 text-gray-800 dark:text-gray-100">
                <strong>Copy ID:</strong> {copy.copyId}
              </p>
              <p
                className={`mb-3 font-bold ${
                  copy.available
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
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
                  ? "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 text-white"
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
