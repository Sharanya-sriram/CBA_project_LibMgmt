import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import BookCard from "../components/BookCard.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import api from "../api/http-common.js";

const BookCatalog = () => {
  const { user, darkMode } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Mock books data
  const mockBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      publicationDate: "1925-04-10",
      description:
        "A classic American novel about the Jazz Age and the American Dream in the Roaring Twenties.",
      copies: [{ available: true }, { available: true }, { available: false }],
      rating: 4.2,
      isbn: "978-0-7432-7356-5",
      pages: 180,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publicationDate: "1960-07-11",
      description:
        "A gripping tale of racial injustice and childhood innocence in the American South.",
      copies: [{ available: true }, { available: false }],
      rating: 4.8,
      isbn: "978-0-06-112008-4",
      pages: 376,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      genre: "Science Fiction",
      publicationDate: "1949-06-08",
      description:
        "A dystopian novel about totalitarianism, surveillance, and the power of language.",
      copies: [{ available: false }, { available: false }],
      rating: 4.6,
      isbn: "978-0-452-28423-4",
      pages: 328,
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      publicationDate: "1813-01-28",
      description:
        "A witty romance about love, marriage, and social class in Regency England.",
      copies: [{ available: true }, { available: true }],
      rating: 4.4,
      isbn: "978-0-14-143951-8",
      pages: 432,
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      genre: "Fiction",
      publicationDate: "1951-07-16",
      description:
        "A controversial novel about teenage rebellion and alienation in post-war America.",
      copies: [{ available: true }],
      rating: 3.8,
      isbn: "978-0-316-76948-0",
      pages: 277,
    },
    {
      id: 6,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publicationDate: "1954-07-29",
      description:
        "An epic high fantasy adventure about the quest to destroy the One Ring.",
      copies: [{ available: true }, { available: true }, { available: false }],
      rating: 4.9,
      isbn: "978-0-544-00341-5",
      pages: 1216,
    },
  ];

  const genres = [
    "all",
    "Classic",
    "Dystopian",
    "Romance",
    "Adventure",
    "Historical",
    "Fantasy",
    "Psychological",
    "Philosophical",
    "Political Satire",
    "Thriller",
    "Drama",
    "Horror",
  ];
  const availabilityOptions = [
    { value: "all", label: "All Books" },
    { value: "available", label: "Available Only" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "author", label: "Author" },
    { value: "publicationDate", label: "Publication Date" },
    { value: "rating", label: "Rating" },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.getBooks();

        const booksWithCopies = await Promise.all(
          response.data.map(async (book) => {
            // Fetch real copies for this book
            const copiesRes = await api.getCopiesByBookId(book.id);

            return {
              ...book,
              copies: copiesRes.data || [], // real copies from backend
              rating: Number((4.0 + Math.random() * 1).toFixed(2)), // random rating (rounded)
              isbn: `978-${Math.floor(Math.random() * 10000000000)}`, // random ISBN
              pages: Math.floor(200 + Math.random() * 500), // random pages
            };
          })
        );

        setBooks(booksWithCopies);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // Fallback to mock data if API fails
        setBooks(mockBooks);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getAvailableCopies = (book) => {
    return book.copies.filter((copy) => copy.available).length;
  };

  const filteredAndSortedBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "all" || book.genre === selectedGenre;

      const availableCopies = getAvailableCopies(book);
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "available" && availableCopies > 0) ||
        (selectedAvailability === "unavailable" && availableCopies === 0);

      return matchesSearch && matchesGenre && matchesAvailability;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "publicationDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortBy === "rating") {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const BookListItem = ({ book }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-16 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpenIcon className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
              {book.title}
            </h3>
            <Badge
              variant={getAvailableCopies(book) > 0 ? "success" : "danger"}
              size="sm"
            >
              {getAvailableCopies(book) > 0
                ? `${getAvailableCopies(book)} Available`
                : "Unavailable"}
            </Badge>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-1">
            By {book.author}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2 mb-3">
            {book.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <Badge variant="primary" size="sm">
                {book.genre}
              </Badge>
              <span>★ {book.rating}</span>
              <span>{book.pages} pages</span>
              <span>{new Date(book.publicationDate).getFullYear()}</span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="primary">
                <Link to={`/book/${book.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Book Catalog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and explore our extensive collection of {books.length}{" "}
            books
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author, or description..."
                  size="lg"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
              >
                Filters
              </Button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ViewColumnsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre === "all" ? "All Genres" : genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedBooks.length} of {books.length} books
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">View:</span>
            <Badge variant="primary" size="sm">
              {viewMode === "grid" ? "Grid" : "List"}
            </Badge>
          </div>
        </div>

        {/* Books Display */}
        {filteredAndSortedBooks.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedBooks.map((book) =>
              viewMode === "grid" ? (
                <BookCard key={book.id} book={book} />
              ) : (
                <BookListItem key={book.id} book={book} />
              )
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("all");
                setSelectedAvailability("all");
              }}
            >
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
