import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import api from "../api/http-common";

const MyBooks = () => {
  const userId = 2; // assumed user
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
            return book ? { ...book, issuedBookId: entry.id } : null;
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
      // Update backend
      await api.deleteIssuedBook(String(issuedBookId));
      const book=await api.getBook(bookId)
      await api.updateBook(bookId, { ...book.data,available: true });

      // Update frontend (remove returned book from list)
      setMyBooks(prevBooks => prevBooks.filter(b => b.issuedBookId != issuedBookId));
      
    } catch (err) {
      console.error("❌ Error returning book:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 My Borrowed Books</h2>
      {myBooks.length === 0 ? (
        <p>You haven’t borrowed any books yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {myBooks.map(book => (
            <div key={book.id}>
              <BookCard book={book} />
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
