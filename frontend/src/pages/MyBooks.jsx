import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { 
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import Modal from "../components/common/Modal.jsx";
import api from "../api/http-common.js";

const MyBooks = () => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [history, setHistory] = useState([]);



  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        // Fetch issued books from backend
        const issuedBooksResponse = await api.getIssuedBooks();
        
        // Filter books for current user and fetch book details
        const userBooks = issuedBooksResponse.data.filter(
          issuedBook => issuedBook.userId === user.id
        );
        
        // Fetch book details for each issued book
        const booksWithDetails = await Promise.all(
          userBooks.map(async (issuedBook) => {
            try {
              const bookResponse = await api.getBook(issuedBook.bookId);
              return {
                ...issuedBook,
                title: bookResponse.data.title,
                author: bookResponse.data.author,
                genre: bookResponse.data.genre,
                description: bookResponse.data.description,
                dueDate: calculateDueDate(issuedBook.issueDate),
                status: issuedBook.returnDate ? "returned" : "issued",
                renewalCount: 0,
                maxRenewals: 2,
                fine: 0,
                coverColor: getRandomCoverColor()
              };
            } catch (error) {
              console.error(`Failed to fetch book ${issuedBook.bookId}:`, error);
              return {
                ...issuedBook,
                title: `Book ID ${issuedBook.bookId}`,
                author: "Unknown",
                genre: "Unknown",
                description: "Book details not available",
                dueDate: calculateDueDate(issuedBook.issueDate),
                status: issuedBook.returnDate ? "returned" : "issued",
                renewalCount: 0,
                maxRenewals: 2,
                fine: 0,
                coverColor: "from-gray-500 to-gray-700"
              };
            }
          })
        );
        
        setMyBooks(booksWithDetails.filter(book => !book.returnDate));
      } catch (error) {
        console.error("Failed to fetch my books:", error);
        // Fallback to mock data
        setMyBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyBooks();
  }, [user.id]);
  
  const calculateDueDate = (issueDate) => {
    const issue = new Date(issueDate);
    const due = new Date(issue);
    due.setDate(due.getDate() + 30); // 30 days loan period
    return due.toISOString().split('T')[0];
  };
  
  const getRandomCoverColor = () => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-red-500 to-pink-600", 
      "from-green-500 to-teal-600",
      "from-yellow-500 to-orange-600",
      "from-purple-500 to-indigo-600",
      "from-pink-500 to-rose-600"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (book) => {
    if (book.status === "overdue") {
      return <Badge variant="danger">Overdue</Badge>;
    }
    
    const daysRemaining = getDaysRemaining(book.dueDate);
    if (daysRemaining <= 3) {
      return <Badge variant="warning">Due Soon</Badge>;
    }
    
    return <Badge variant="success">Active</Badge>;
  };

  const handleReturnBook = (book) => {
    setSelectedBook(book);
    setShowReturnModal(true);
  };

  const confirmReturn = async () => {
    try {
      // Update the issued book with return date
      await api.updateIssuedBook(selectedBook.id, {
        ...selectedBook,
        returnDate: new Date().toISOString().split('T')[0]
      });
      
      // Remove book from current list
      setMyBooks(prev => prev.filter(book => book.id !== selectedBook.id));
      setShowReturnModal(false);
      setSelectedBook(null);
      alert(`✅ Book "${selectedBook.title}" returned successfully!`);
    } catch (error) {
      console.error("Failed to return book:", error);
      alert("Failed to return book. Please try again.");
    }
  };

  const handleRenewBook = (bookId) => {
    setMyBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { 
            ...book, 
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            renewalCount: book.renewalCount + 1 
          }
        : book
    ));
  };

  const BookCard = ({ book, isHistory = false }) => (
    <Card className="overflow-hidden">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className={`w-20 h-28 rounded-lg bg-gradient-to-br ${book.coverColor || 'from-gray-500 to-gray-700'} flex items-center justify-center flex-shrink-0`}>
          <BookOpenIcon className="w-8 h-8 text-white" />
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">by {book.author}</p>
              <Badge variant="primary" size="sm" className="mt-1">
                {book.genre}
              </Badge>
            </div>
            
            {!isHistory && getStatusBadge(book)}
          </div>

          {/* Dates and Status */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>Issued: {new Date(book.issueDate).toLocaleDateString()}</span>
            </div>
            
            {!isHistory ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="w-4 h-4" />
                  <span className={isOverdue(book.dueDate) ? "text-red-600 font-medium" : "text-gray-600 dark:text-gray-400"}>
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                    {isOverdue(book.dueDate) 
                      ? ` (${Math.abs(getDaysRemaining(book.dueDate))} days overdue)`
                      : ` (${getDaysRemaining(book.dueDate)} days remaining)`
                    }
                  </span>
                </div>

                {book.fine > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="font-medium">Fine: ${book.fine.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Renewals: {book.renewalCount}/{book.maxRenewals}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Returned: {new Date(book.returnDate).toLocaleDateString()}</span>
                </div>
                {book.rating && (
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <span>★</span>
                    <span>Your Rating: {book.rating}/5</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {!isHistory && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleReturnBook(book)}
              >
                Return Book
              </Button>
              
              {book.renewalCount < book.maxRenewals && !isOverdue(book.dueDate) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRenewBook(book.id)}
                >
                  Renew
                </Button>
              )}
              
              <Button size="sm" variant="ghost">
                Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const currentBooks = myBooks;
  const overdueBooks = myBooks.filter(book => book.status === "overdue");
  const totalFines = myBooks.reduce((sum, book) => sum + book.fine, 0);

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
            📚 My Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your borrowed books and reading history
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentBooks.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Books</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueBooks.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <InformationCircleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalFines.toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Fines</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Books Read</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("current")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "current"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
                }`}
              >
                Current Books ({currentBooks.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
                }`}
              >
                Reading History ({history.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "current" ? (
          <div className="space-y-6">
            {currentBooks.length > 0 ? (
              currentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <Card className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No books currently borrowed
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Visit the catalog to discover and borrow books
                </p>
                <Button variant="primary">Browse Catalog</Button>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {history.map(book => (
              <BookCard key={book.id} book={book} isHistory={true} />
            ))}
          </div>
        )}

        {/* Return Confirmation Modal */}
        <Modal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          title="Return Book"
        >
          {selectedBook && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to return "<strong>{selectedBook.title}</strong>"?
              </p>
              
              {selectedBook.fine > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Outstanding Fine: ${selectedBook.fine.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Please settle this fine at the library counter.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button variant="danger" onClick={confirmReturn} className="flex-1">
                  Confirm Return
                </Button>
                <Button variant="outline" onClick={() => setShowReturnModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyBooks;
