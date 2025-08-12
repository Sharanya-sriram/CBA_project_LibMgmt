// src/pages/Home.jsx
import { useEffect, useState } from "react";
import BookCard from "../components/BookCard.jsx";
import api from "../api/http-common.js";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const { user, darkMode } = useAuth();

  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalUsers: 0,
  });

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen px-6 py-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">
        Welcome {user ? user.username : ""}! 😊
      </h2>

      {/* Stats Section */}
      <h3 className="text-xl font-semibold mb-3">📊 Library Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Books", value: stats.totalBooks },
          { label: "Available Books", value: stats.availableBooks },
          { label: "Issued Books", value: stats.issuedBooks },
          { label: "Total Users", value: stats.totalUsers },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <h3 className="text-xl font-semibold mb-3">📚 All Books</h3>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full max-w-md p-2 rounded-md border mb-4 focus:outline-none focus:ring-2 transition ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-indigo-500"
            : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"
        }`}
      />

      {/* Book Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <p className="col-span-full text-center text-lg">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
