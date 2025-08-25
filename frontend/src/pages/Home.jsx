import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import BookCard from "../components/BookCard.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import api from "../api/http-common.js";

const Home = () => {
  const { user, darkMode } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
    newBooksThisMonth: 0,
  });

  const [books, setBooks] = useState([]);



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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch books and other data from backend
        const [booksResponse, usersResponse, issuedBooksResponse] =
          await Promise.all([
            api.getBooks(),
            api.getUsers(),
            api.getIssuedBooks(),
          ]);


          const booksWithCopies = await Promise.all(
            booksResponse.data.map(async (book) => {
              const copiesResponse = await api.getCopiesByBookId(`${book.id}`);
              return {
                ...book,
                copies: copiesResponse.data,  // 👈 now real copies
                rating: Number((4.0 + Math.random() * 1).toFixed(2)),
                isNew: new Date(book.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                isFeatured: Math.random() > 0.6,
              };
            })
          );
          
          setBooks(booksWithCopies);

        // Calculate real statistics
        setStats({
          totalBooks: booksResponse.data.length,
          availableBooks: booksResponse.data.reduce(
            (acc, book) =>
              acc + (book.copies?.filter((copy) => copy.available).length || 0),
            0
          ),
          issuedBooks: issuedBooksResponse.data.length,
          overdueBooks: issuedBooksResponse.data.filter(
            (issue) => new Date(issue.returnDate) < new Date()
          ).length,
          totalUsers: usersResponse.data.length,
          newBooksThisMonth: booksResponse.data.filter(
            (book) =>
              new Date(book.createdAt) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to mock data if API fails
        setBooks([
          {
            id: 1,
            title: "Connection Failed - Demo Mode",
            author: "System",
            genre: "Error",
            publicationDate: "2024-01-01",
            description: "Backend connection failed. Using demo data.",
            copies: [{ available: true }],
            rating: 4.0,
            isNew: false,
            isFeatured: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const featuredBooks = books.filter((book) => book.isFeatured);
  const newBooks = books.filter((book) => book.isNew);

  const getColorClasses = (color) => {
    const colorMap = {
      indigo: {
        bg: "bg-indigo-100 dark:bg-indigo-900/20",
        text: "text-indigo-600 dark:text-indigo-400",
      },
      emerald: {
        bg: "bg-emerald-100 dark:bg-emerald-900/20",
        text: "text-emerald-600 dark:text-emerald-400",
      },
      amber: {
        bg: "bg-amber-100 dark:bg-amber-900/20",
        text: "text-amber-600 dark:text-amber-400",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-600 dark:text-purple-400",
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
      },
    };
    return colorMap[color] || colorMap.indigo;
  };

  const StatCard = ({ icon: Icon, title, value, change, color = "indigo" }) => {
    const colorClasses = getColorClasses(color);

    return (
      <Card className="relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  {change} this month
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses.bg}`}>
            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.username || "Student"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Badge variant="primary" className="px-3 py-1">
                {user?.role === "admin" ? "Administrator" : "Student"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpenIcon}
            title="Total Books"
            value={stats.totalBooks.toLocaleString()}
            change={stats.newBooksThisMonth}
            color="indigo"
          />
          <StatCard
            icon={CheckCircleIcon}
            title="Available Books"
            value={stats.availableBooks.toLocaleString()}
            color="emerald"
          />
          <StatCard
            icon={ClockIcon}
            title="Books Issued"
            value={stats.issuedBooks}
            color="amber"
          />
          <StatCard
            icon={UserGroupIcon}
            title="Active Members"
            value={stats.totalUsers.toLocaleString()}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Books */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6 text-yellow-500" />
                  Featured Books
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllFeatured(!showAllFeatured)}
                >
                  {showAllFeatured ? "Show Less" : "View All"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(showAllFeatured
                  ? featuredBooks
                  : featuredBooks.slice(0, 2)
                ).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6 text-indigo-500" />
                Browse Catalog
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search books by title or author..."
                    size="md"
                  />
                </div>

                <div className="sm:w-48">
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre === "all" ? "All Genres" : genre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No books found
                    </p>
                    <p className="text-gray-400 dark:text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* New Arrivals */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-500" />
                  New Arrivals
                </h3>
                <Badge variant="info" size="sm">
                  {newBooks.length} new
                </Badge>
              </div>

              <div className="space-y-4">
                {newBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {book.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="success" size="sm">
                          New
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {book.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-start"
                  icon={<BookOpenIcon className="w-4 h-4" />}
                  onClick={() => navigate("/catalog")}
                >
                  Browse All Books
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<ClockIcon className="w-4 h-4" />}
                  onClick={() => navigate("/mybooks")}
                >
                  My Issued Books
                </Button>
                
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
