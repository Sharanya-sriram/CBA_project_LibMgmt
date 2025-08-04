import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import api from "../api/http-common";

const MyBooks = () => {
  const userId = 2; // assumed logged-in user
  const [myBooks, setMyBooks] = useState([]);

  const fetchMyBooks = async () => {
    try {
      const [booksRes, issuedRes] = await Promise.all([
        api.getBooks(),
        api.getIssuedBooks()
      ]);
  
      const books = booksRes.data;
      const issued = issuedRes.data;
  
      const myIssued = issued.filter(entry => entry.userId === userId);
  
      const borrowedBooks = myIssued.map(entry => {
        const book = books.find(b => b.id === entry.bookId);
        return book ? { ...book, issuedBookId: entry.id } : null;
      }).filter(Boolean); // filter out nulls
  
      setMyBooks(borrowedBooks);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };
  

  const handleReturn = async (bookId, issuedBookId) => {
    try {
      await api.deleteIssuedBook(issuedBookId); // ✅ Use correct issuedBookId
      await api.updateBook(bookId, { available: true }); // ✅ Only update available
      fetchMyBooks(); // Refresh UI
    } catch (err) {
      console.error("Error returning book:", err);
    }
  };
  

  useEffect(() => {
    fetchMyBooks();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 My Borrowed Books</h2>
      {myBooks.length === 0 ? (
        <p>You haven’t borrowed any books yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {myBooks.map((book) => (
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
        cursor: "pointer"
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
