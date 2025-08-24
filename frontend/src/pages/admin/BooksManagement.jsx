import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import api from "../../api/http-common.js";

// BookForm component moved outside to prevent re-creation
const BookForm = React.memo(({ title, bookForm, onFormChange, onSubmit, onCancel, genres }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Title"
        value={bookForm.title}
        onChange={(e) => onFormChange('title', e.target.value)}
        placeholder="Enter book title"
        required
      />
      <Input
        label="Author"
        value={bookForm.author}
        onChange={(e) => onFormChange('author', e.target.value)}
        placeholder="Enter author name"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Genre
        </label>
        <select
          value={bookForm.genre}
          onChange={(e) => onFormChange('genre', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="">Select genre</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <Input
        label="Publication Date"
        type="date"
        value={bookForm.publicationDate}
        onChange={(e) => onFormChange('publicationDate', e.target.value)}
        required
      />
      <Input
        label="Pages"
        type="number"
        value={bookForm.pages}
        onChange={(e) => onFormChange('pages', e.target.value)}
        placeholder="Number of pages"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="ISBN"
        value={bookForm.isbn}
        onChange={(e) => onFormChange('isbn', e.target.value)}
        placeholder="978-0-123456-78-9"
        required
      />
      <Input
        label="Number of Copies"
        type="number"
        min="1"
        value={bookForm.copies}
        onChange={(e) => onFormChange('copies', e.target.value)}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={bookForm.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        placeholder="Enter book description"
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        required
      />
    </div>

    <div className="flex gap-3 pt-4">
      <Button variant="primary" onClick={onSubmit} className="flex-1">
        {title === "Add New Book" ? "Add Book" : "Update Book"}
      </Button>
      <Button variant="outline" onClick={onCancel} className="flex-1">
        Cancel
      </Button>
    </div>
  </div>
));

const BooksManagement = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Form state for add/edit book
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    genre: "",
    publicationDate: "",
    description: "",
    isbn: "",
    pages: "",
    copies: 1
  });

  // Memoized form handlers to prevent cursor issues
  const handleFormChange = useCallback((field, value) => {
    setBookForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Mock books data
  const mockBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Fiction",
      publicationDate: "1925-04-10",
      description: "A classic American novel about the Jazz Age and the American Dream.",
      isbn: "978-0-7432-7356-5",
      pages: 180,
      totalCopies: 3,
      availableCopies: 2,
      issuedCopies: 1,
      addedDate: "2024-01-01",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Fiction",
      publicationDate: "1960-07-11",
      description: "A gripping tale of racial injustice and childhood innocence.",
      isbn: "978-0-06-112008-4",
      pages: 376,
      totalCopies: 2,
      availableCopies: 1,
      issuedCopies: 1,
      addedDate: "2024-01-02",
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      genre: "Science Fiction",
      publicationDate: "1949-06-08",
      description: "A dystopian novel about totalitarianism and surveillance.",
      isbn: "978-0-452-28423-4",
      pages: 328,
      totalCopies: 2,
      availableCopies: 0,
      issuedCopies: 2,
      addedDate: "2024-01-03",
      lastUpdated: "2024-01-12"
    }
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

  useEffect(() => {
    fetchBooks();
  }, []);
  
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.getBooks();
      
      // Process books data with copy information
      const booksWithCopies = response.data.map(book => ({
        ...book,
        totalCopies: book.copies?.length || 0,
        availableCopies: book.copies?.filter(copy => copy.available).length || 0,
        issuedCopies: book.copies?.filter(copy => !copy.available).length || 0,
        addedDate: book.createdAt || new Date().toISOString().split('T')[0],
        lastUpdated: book.updatedAt || new Date().toISOString().split('T')[0],
        isbn: book.isbn || `978-${Math.floor(Math.random() * 10000000000)}`,
        pages: book.pages || Math.floor(200 + Math.random() * 500)
      }));
      
      setBooks(booksWithCopies);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      // Fallback to mock data
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleAddBook = useCallback(async () => {
    try {
      // Create book in backend
      const bookData = {
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
        publicationDate: bookForm.publicationDate,
        description: bookForm.description
      };
      
      const bookResponse = await api.addBook(bookData);
      const newBookId = bookResponse.data.id;
      
      // Create copies for the book
      const copyPromises = [];
      for (let i = 1; i <= parseInt(bookForm.copies); i++) {
        const copyData = {
          bookId: newBookId,
          copyId: `${bookForm.title.replace(/\s+/g, '').toUpperCase()}-${i}`,
          available: true
        };
        copyPromises.push(api.addCopy(copyData));
      }
      
      await Promise.all(copyPromises);
      
      // Refresh books list
      await fetchBooks();
      
      setShowAddModal(false);
      resetForm();
      alert("✅ Book added successfully!");
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("❌ Failed to add book. Please try again.");
    }
  }, [bookForm]);

  const handleEditBook = useCallback(async () => {
    try {
      const bookData = {
        title: bookForm.title,
        author: bookForm.author,
        genre: bookForm.genre,
        publicationDate: bookForm.publicationDate,
        description: bookForm.description
      };
      
      await api.updateBook(selectedBook.id, bookData);
      
      // Refresh books list
      await fetchBooks();
      
      setShowEditModal(false);
      setSelectedBook(null);
      resetForm();
      alert("✅ Book updated successfully!");
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("❌ Failed to update book. Please try again.");
    }
  }, [bookForm, selectedBook]);

  const handleDeleteBook = async () => {
    try {
      // Delete all copies first
      if (selectedBook.copies && selectedBook.copies.length > 0) {
        const deletePromises = selectedBook.copies.map(copy => 
          api.deleteCopy(copy.id)
        );
        await Promise.all(deletePromises);
      }
      
      // Delete the book
      await api.deleteBook(selectedBook.id);
      
      // Refresh books list
      await fetchBooks();
      
      setShowDeleteModal(false);
      setSelectedBook(null);
      alert("✅ Book deleted successfully!");
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("❌ Failed to delete book. Please try again.");
    }
  };

  const resetForm = useCallback(() => {
    setBookForm({
      title: "",
      author: "",
      genre: "",
      publicationDate: "",
      description: "",
      isbn: "",
      pages: "",
      copies: 1
    });
  }, []);

  const openEditModal = (book) => {
    setSelectedBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publicationDate: book.publicationDate,
      description: book.description,
      isbn: book.isbn,
      pages: book.pages.toString(),
      copies: book.totalCopies.toString()
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const BookRow = ({ book, index }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
            <BookOpenIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{book.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{book.author}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant="primary" size="sm">{book.genre}</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {book.isbn}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {book.pages}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-900 dark:text-white">
            Total: {book.totalCopies}
          </span>
          <div className="flex gap-2">
            <Badge variant="success" size="sm">
              Available: {book.availableCopies}
            </Badge>
            <Badge variant="warning" size="sm">
              Issued: {book.issuedCopies}
            </Badge>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(book.addedDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" icon={<EyeIcon className="w-4 h-4" />}>
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => openEditModal(book)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => openDeleteModal(book)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📚 Books Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your library's book collection
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              
              <Button
                variant="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setShowAddModal(true)}
              >
                Add Book
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author, or ISBN..."
                  size="md"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  icon={<FunnelIcon className="w-4 h-4" />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{books.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {books.reduce((sum, book) => sum + book.availableCopies, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Copies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {books.reduce((sum, book) => sum + book.issuedCopies, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Issued Copies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {books.reduce((sum, book) => sum + book.totalCopies, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Copies</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Books Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book, index) => (
                    <BookRow key={book.id} book={book} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No books found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Book Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="Add New Book"
          size="lg"
        >
          <BookForm
            title="Add New Book"
            bookForm={bookForm}
            onFormChange={handleFormChange}
            onSubmit={handleAddBook}
            onCancel={() => { setShowAddModal(false); resetForm(); }}
            genres={genres}
          />
        </Modal>

        {/* Edit Book Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedBook(null); resetForm(); }}
          title="Edit Book"
          size="lg"
        >
          <BookForm
            title="Edit Book"
            bookForm={bookForm}
            onFormChange={handleFormChange}
            onSubmit={handleEditBook}
            onCancel={() => { setShowEditModal(false); setSelectedBook(null); resetForm(); }}
            genres={genres}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedBook(null); }}
          title="Delete Book"
        >
          {selectedBook && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete "<strong>{selectedBook.title}</strong>"?
              </p>
              
              {selectedBook.issuedCopies > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This book has {selectedBook.issuedCopies} issued copies. 
                    Please ensure all copies are returned before deletion.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button variant="danger" onClick={handleDeleteBook} className="flex-1">
                  Delete Book
                </Button>
                <Button variant="outline" onClick={() => { setShowDeleteModal(false); setSelectedBook(null); }} className="flex-1">
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

export default BooksManagement;