import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import api from "../api/http-common";

const MyBooks = () => {
  const userId = 1; // assumed user
  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const [booksRes, issuedRes] = await Promise.all([
          api.getBooks(),
          api.getIssuedBooks(),
        ]);

        const books = booksRes.data;
        const issued = issuedRes.data;

        const myIssued = issued.filter(entry => entry.userId == userId);

        const borrowedBooks = myIssued
          .map(entry => {
            const book = books.find(b => b.id == entry.bookId);
            return book
              ? {
                  ...book,
                  issuedBookId: entry.id,
                  issueDate: entry.issueDate,
                  returnDate: entry.returnDate
                }
              : 1;
          })
          .filter(Boolean);

        setMyBooks(borrowedBooks);
      } catch (err) {
        console.error("❌ Failed to fetch borrowed books:", err);
      }
    };

    fetchMyBooks();
  }, []);

  const handleReturn = async (bookId, issuedBookId) => {
    try {
      // Delete issued record
      await api.deleteIssuedBook(String(issuedBookId));

      // Update book copies to available
      const book = await api.getBook(bookId);
      await api.updateBook(bookId, { ...book.data, available: true });

      // Remove from state
      setMyBooks(prevBooks =>
        prevBooks.filter(b => b.issuedBookId != issuedBookId)
      );
    } catch (err) {
      console.error("❌ Error returning book:", err);
    }
  };

  const isLate = (returnDate) => {
    const today = new Date().setHours(0,0,0,0);
    const due = new Date(returnDate).setHours(0,0,0,0);
    return today > due;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 My Borrowed Books</h2>
      {myBooks.length === 0 ? (
        <p>You haven’t borrowed any books yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {myBooks.map(book => (
            <div key={book.id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
              <BookCard book={book} />
              
              <p><strong>📅 Due Date:</strong> {book.returnDate}</p>
              {isLate(book.returnDate) && (
                <p style={{ color: "red", fontWeight: "bold" }}>⚠ Overdue!</p>
              )}

              <button
                onClick={() => handleReturn(book.id, book.issuedBookId)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Return
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
