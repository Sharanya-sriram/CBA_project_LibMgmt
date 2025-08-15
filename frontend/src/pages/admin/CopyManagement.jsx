import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  DocumentDuplicateIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import api from "../../api/http-common.js";

const CopyManagement = () => {
  const { user } = useAuth();
  const [copies, setCopies] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedBookFilter, setSelectedBookFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState(null);

  // Form state for add/edit copy
  const [copyForm, setCopyForm] = useState({
    bookId: "",
    copyId: "",
    available: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [copiesResponse, booksResponse] = await Promise.all([
        api.getCopies(),
        api.getBooks()
      ]);

      // Enrich copies with book information
      const copiesWithBooks = copiesResponse.data.map(copy => {
        const book = booksResponse.data.find(b => b.id === copy.bookId);
        return {
          ...copy,
          bookTitle: book?.title || `Book ID ${copy.bookId}`,
          bookAuthor: book?.author || "Unknown Author"
        };
      });

      setCopies(copiesWithBooks);
      setBooks(booksResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Fallback mock data
      setCopies([
        {
          id: 1,
          bookId: 1,
          copyId: "GATSBY-1",
          available: false,
          bookTitle: "The Great Gatsby",
          bookAuthor: "F. Scott Fitzgerald"
        },
        {
          id: 2,
          bookId: 1,
          copyId: "GATSBY-2", 
          available: true,
          bookTitle: "The Great Gatsby",
          bookAuthor: "F. Scott Fitzgerald"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCopies = copies.filter(copy => {
    const matchesSearch = copy.copyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         copy.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         copy.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "all" ||
                               (availabilityFilter === "available" && copy.available) ||
                               (availabilityFilter === "unavailable" && !copy.available);
    
    const matchesBook = selectedBookFilter === "all" || copy.bookId === parseInt(selectedBookFilter);

    return matchesSearch && matchesAvailability && matchesBook;
  });

  const handleAddCopy = async () => {
    try {
      const copyData = {
        bookId: parseInt(copyForm.bookId),
        copyId: copyForm.copyId,
        available: copyForm.available
      };

      await api.addCopy(copyData);
      await fetchData();
      
      setShowAddModal(false);
      resetForm();
      alert("✅ Copy added successfully!");
    } catch (error) {
      console.error("Failed to add copy:", error);
      alert("❌ Failed to add copy. Please try again.");
    }
  };

  const handleEditCopy = async () => {
    try {
      const copyData = {
        bookId: parseInt(copyForm.bookId),
        copyId: copyForm.copyId,
        available: copyForm.available
      };

      await api.updateCopy(selectedCopy.id, copyData);
      await fetchData();
      
      setShowEditModal(false);
      setSelectedCopy(null);
      resetForm();
      alert("✅ Copy updated successfully!");
    } catch (error) {
      console.error("Failed to update copy:", error);
      alert("❌ Failed to update copy. Please try again.");
    }
  };

  const handleDeleteCopy = async () => {
    try {
      await api.deleteCopy(selectedCopy.id);
      await fetchData();
      
      setShowDeleteModal(false);
      setSelectedCopy(null);
      alert("✅ Copy deleted successfully!");
    } catch (error) {
      console.error("Failed to delete copy:", error);
      alert("❌ Failed to delete copy. Please try again.");
    }
  };

  const resetForm = () => {
    setCopyForm({
      bookId: "",
      copyId: "",
      available: true
    });
  };

  const openEditModal = (copy) => {
    setSelectedCopy(copy);
    setCopyForm({
      bookId: copy.bookId.toString(),
      copyId: copy.copyId,
      available: copy.available
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (copy) => {
    setSelectedCopy(copy);
    setShowDeleteModal(true);
  };

  const CopyRow = ({ copy, index }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
            <DocumentDuplicateIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{copy.copyId}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Copy #{copy.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{copy.bookTitle}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{copy.bookAuthor}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        Book ID: {copy.bookId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {copy.available ? (
          <Badge variant="success" size="sm" icon={<CheckCircleIcon className="w-3 h-3" />}>
            Available
          </Badge>
        ) : (
          <Badge variant="danger" size="sm" icon={<XCircleIcon className="w-3 h-3" />}>
            Issued
          </Badge>
        )}
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
            onClick={() => openEditModal(copy)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => openDeleteModal(copy)}
            disabled={!copy.available} // Don't allow deletion of issued copies
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );

  const CopyForm = ({ title, onSubmit, onCancel }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Book
          </label>
          <select
            value={copyForm.bookId}
            onChange={(e) => setCopyForm({ ...copyForm, bookId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Select book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Copy ID"
          value={copyForm.copyId}
          onChange={(e) => setCopyForm({ ...copyForm, copyId: e.target.value })}
          placeholder="e.g., GATSBY-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Availability Status
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="available"
              checked={copyForm.available === true}
              onChange={() => setCopyForm({ ...copyForm, available: true })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="available"
              checked={copyForm.available === false}
              onChange={() => setCopyForm({ ...copyForm, available: false })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Issued</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="primary" onClick={onSubmit} className="flex-1">
          {title === "Add New Copy" ? "Add Copy" : "Update Copy"}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );

  const stats = {
    total: copies.length,
    available: copies.filter(copy => copy.available).length,
    issued: copies.filter(copy => !copy.available).length,
    books: [...new Set(copies.map(copy => copy.bookId))].length
  };

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
                📋 Copy Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage individual book copies and their availability
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setShowAddModal(true)}
              >
                Add Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <DocumentDuplicateIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Copies</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.available}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.issued}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Currently Issued</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.books}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Books</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by copy ID, book title, or author..."
                  size="md"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Issued</option>
                </select>

                <select
                  value={selectedBookFilter}
                  onChange={(e) => setSelectedBookFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Books</option>
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Copies Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Copy ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Book ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCopies.length > 0 ? (
                  filteredCopies.map((copy, index) => (
                    <CopyRow key={copy.id} copy={copy} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <DocumentDuplicateIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No copies found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Copy Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="Add New Copy"
          size="lg"
        >
          <CopyForm
            title="Add New Copy"
            onSubmit={handleAddCopy}
            onCancel={() => { setShowAddModal(false); resetForm(); }}
          />
        </Modal>

        {/* Edit Copy Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedCopy(null); resetForm(); }}
          title="Edit Copy"
          size="lg"
        >
          <CopyForm
            title="Edit Copy"
            onSubmit={handleEditCopy}
            onCancel={() => { setShowEditModal(false); setSelectedCopy(null); resetForm(); }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedCopy(null); }}
          title="Delete Copy"
        >
          {selectedCopy && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete copy "<strong>{selectedCopy.copyId}</strong>" 
                of "<strong>{selectedCopy.bookTitle}</strong>"?
              </p>
              
              {!selectedCopy.available && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This copy is currently issued and cannot be deleted.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="danger" 
                  onClick={handleDeleteCopy} 
                  className="flex-1"
                  disabled={!selectedCopy.available}
                >
                  Delete Copy
                </Button>
                <Button variant="outline" onClick={() => { setShowDeleteModal(false); setSelectedCopy(null); }} className="flex-1">
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

export default CopyManagement;