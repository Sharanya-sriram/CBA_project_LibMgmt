// src/pages/Home.jsx
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import api from "../api/http-common";
import {useAuth} from '../context/AuthContext.jsx'
const Home = () => {
  const {user}=useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalUsers: 0,
  });

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, usersRes, issuedRes] = await Promise.all([
          api.getBooks(),
          api.getUsers(),
          api.getIssuedBooks(),
        ]);

        const booksData = booksRes.data;
        const usersData = usersRes.data;
        const issuedBooksData = issuedRes.data;

        const availableBooks = booksData.filter((book) => book.available).length;

        setBooks(booksData);
        setStats({
          totalBooks: booksData.length,
          availableBooks,
          issuedBooks: issuedBooksData.length,
          totalUsers: usersData.length,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  // 🔍 filter logic (case-insensitive search)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome {user?user.username:""}!😊</h2>
      <h3>📊 Library Overview</h3>
      <ul>
        <li>Total Books: {stats.totalBooks}</li>
        <li>Available Books: {stats.availableBooks}</li>
        <li>Issued Books: {stats.issuedBooks}</li>
        <li>Total Users: {stats.totalUsers}</li>
      </ul>

      <h3>📚 All Books</h3>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      {/* 🔍 Filtered results */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
