import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  ArrowUturnLeftIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import api from "../../api/http-common.js";

const IssueManagement = () => {
  const { user } = useAuth();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [availableCopies, setAvailableCopies] = useState([]);

  // Form state for issuing books
  const [issueForm, setIssueForm] = useState({
    userId: "",
    bookId: "",
    copyId: "",
    issueDate: new Date().toISOString().split('T')[0]
  });
  useEffect(() => {
    if (!issueForm.bookId) return;
  
    const fetchCopies = async () => {
      const copies = await getAvailableCopies(issueForm.bookId);
      setAvailableCopies(copies);
    };
  
    fetchCopies();
  }, [issueForm.bookId]);
  useEffect(() => {
    fetchData();
  }, []);
  const getCopies=async (bookId)=>{
    try {
      const response = await api.getCopiesByBookId(bookId);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch copies:", error);
      return [];
    }
  }
  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuedResponse, booksResponse, usersResponse] = await Promise.all([
        api.getIssuedBooks(),
        api.getBooks(),
        api.getUsers()
      ]);

      const issuedBooksData = issuedResponse.data.map(issue => {
        const book = booksResponse.data.find(b => b.id === issue.bookId);
        const user = usersResponse.data.find(u => u.id === issue.userId);
        
        return {
          ...issue,
          bookTitle: book?.title || `Book ID ${issue.bookId}`,
          bookAuthor: book?.author || "Unknown",
          userName: user?.name || `User ID ${issue.userId}`,
          userEmail: user?.email || "",
          dueDate: calculateDueDate(issue.issueDate),
          isOverdue: isOverdue(issue.issueDate) && !issue.returnDate
        };
      });

      setIssuedBooks(issuedBooksData);
      setBooks(booksResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDueDate = (issueDate) => {
    const issue = new Date(issueDate);
    const due = new Date(issue);
    due.setDate(due.getDate() + 30); // 30 days loan period
    return due.toISOString().split('T')[0];
  };

  const isOverdue = (issueDate) => {
    const dueDate = calculateDueDate(issueDate);
    return new Date() > new Date(dueDate);
  };

  const filteredIssues = issuedBooks.filter(issue => {
    const matchesSearch = issue.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.copyId.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = !issue.returnDate;
    if (statusFilter === "returned") matchesStatus = !!issue.returnDate;
    if (statusFilter === "overdue") matchesStatus = issue.isOverdue && !issue.returnDate;

    return matchesSearch && matchesStatus;
  });

  const handleIssueBook = async () => {
    try {
      await api.addIssuedBook({
        userId: parseInt(issueForm.userId),
        bookId: parseInt(issueForm.bookId),
        copyId: issueForm.copyId,
        issueDate: issueForm.issueDate,
        returnDate: null
      });

      await fetchData();
      setShowIssueModal(false);
      resetIssueForm();
      alert("✅ Book issued successfully!");
    } catch (error) {
      console.error("Failed to issue book:", error);
      alert("❌ Failed to issue book. Please try again.");
    }
  };

  const handleReturnBook = async () => {
    try {
      await api.updateIssuedBook(selectedIssue.id, {
        ...selectedIssue,
        returnDate: new Date().toISOString().split('T')[0]
      });

      await fetchData();
      setShowReturnModal(false);
      setSelectedIssue(null);
      alert("✅ Book returned successfully!");
    } catch (error) {
      console.error("Failed to return book:", error);
      alert("❌ Failed to return book. Please try again.");
    }
  };

  const handleDeleteIssueRecord = async () => {
    try {
      await api.deleteIssuedBook(selectedIssue.id);
      await fetchData();
      
      setShowDeleteModal(false);
      setSelectedIssue(null);
      alert("✅ Issue record deleted permanently!");
    } catch (error) {
      console.error("Failed to delete issue record:", error);
      alert("❌ Failed to delete issue record. Please try again.");
    }
  };

  const resetIssueForm = () => {
    setIssueForm({
      userId: "",
      bookId: "",
      copyId: "",
      issueDate: new Date().toISOString().split('T')[0]
    });
  };

  const getAvailableCopies =async (bookId) => {
    const copies=await getCopies(bookId);
    return copies?.filter(copy => copy.available) || [];
  };

  const IssueRow = ({ issue, index }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
            <BookOpenIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{issue.bookTitle}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{issue.bookAuthor}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{issue.userName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{issue.userEmail}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {issue.copyId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {new Date(issue.issueDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {issue.returnDate ? (
          <span className="text-gray-900 dark:text-white">
            {new Date(issue.returnDate).toLocaleDateString()}
          </span>
        ) : (
          <span className={issue.isOverdue ? "text-red-600 font-medium" : "text-gray-900 dark:text-white"}>
            {new Date(issue.dueDate).toLocaleDateString()}
            {issue.isOverdue && (
              <div className="text-xs text-red-600">Overdue</div>
            )}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {issue.returnDate ? (
          <Badge variant="success" size="sm">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Returned
          </Badge>
        ) : issue.isOverdue ? (
          <Badge variant="danger" size="sm">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            <ClockIcon className="w-3 h-3 mr-1" />
            Issued
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<EyeIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedIssue(issue);
              setShowDetailModal(true);
            }}
          >
            View
          </Button>
          
          {!issue.returnDate && (
            <Button
              size="sm"
              variant="success"
              icon={<ArrowUturnLeftIcon className="w-4 h-4" />}
              onClick={() => {
                setSelectedIssue(issue);
                setShowReturnModal(true);
              }}
            >
              Return
            </Button>
          )}
          
          <Button
            size="sm"
            variant="danger"
            icon={<TrashIcon className="w-4 h-4" />}
            onClick={() => {
              setSelectedIssue(issue);
              setShowDeleteModal(true);
            }}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );

  const stats = {
    total: issuedBooks.length,
    active: issuedBooks.filter(issue => !issue.returnDate).length,
    returned: issuedBooks.filter(issue => issue.returnDate).length,
    overdue: issuedBooks.filter(issue => issue.isOverdue && !issue.returnDate).length
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
                📋 Issue Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage book issues, returns, and track overdue items
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setShowIssueModal(true)}
              >
                Issue Book
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Issues</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Currently Issued</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.returned}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Returned</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
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
                  placeholder="Search by book title, user name, or copy ID..."
                  size="md"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Currently Issued</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Issues Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Copy ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due / Return Date
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
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue, index) => (
                    <IssueRow key={issue.id} issue={issue} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No issues found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Issue Book Modal */}
        <Modal
          isOpen={showIssueModal}
          onClose={() => { setShowIssueModal(false); resetIssueForm(); }}
          title="Issue Book"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  User
                </label>
                <select
                  value={issueForm.userId}
                  onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} (@{user.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Book
                </label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value, copyId: "" })}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Copy
                </label>
                <select
                  value={issueForm.copyId}
                  onChange={(e) => setIssueForm({ ...issueForm, copyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                  disabled={!issueForm.bookId}
                >
                  <option value="">Select copy</option>
                  {availableCopies.map(copy => (
                    <option key={copy.copyId} value={copy.copyId}>
                      {copy.copyId}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Issue Date"
                type="date"
                value={issueForm.issueDate}
                onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="primary" onClick={handleIssueBook} className="flex-1">
                Issue Book
              </Button>
              <Button variant="outline" onClick={() => { setShowIssueModal(false); resetIssueForm(); }} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Return Book Modal */}
        <Modal
          isOpen={showReturnModal}
          onClose={() => { setShowReturnModal(false); setSelectedIssue(null); }}
          title="Return Book"
        >
          {selectedIssue && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to mark "<strong>{selectedIssue.bookTitle}</strong>" 
                (Copy: {selectedIssue.copyId}) as returned by <strong>{selectedIssue.userName}</strong>?
              </p>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Issue Date:</strong> {new Date(selectedIssue.issueDate).toLocaleDateString()}<br />
                  <strong>Due Date:</strong> {new Date(selectedIssue.dueDate).toLocaleDateString()}<br />
                  {selectedIssue.isOverdue && (
                    <span className="text-red-600 font-medium">
                      ⚠️ This book is overdue
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="success" onClick={handleReturnBook} className="flex-1">
                  Confirm Return
                </Button>
                <Button variant="outline" onClick={() => { setShowReturnModal(false); setSelectedIssue(null); }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedIssue(null); }}
          title="Delete Issue Record"
        >
          {selectedIssue && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to permanently delete the issue record for 
                "<strong>{selectedIssue.bookTitle}</strong>" (Copy: {selectedIssue.copyId}) 
                issued to <strong>{selectedIssue.userName}</strong>?
              </p>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone. The issue record will be permanently removed from the system.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="danger" onClick={handleDeleteIssueRecord} className="flex-1">
                  Delete Permanently
                </Button>
                <Button variant="outline" onClick={() => { setShowDeleteModal(false); setSelectedIssue(null); }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Detail View Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => { setShowDetailModal(false); setSelectedIssue(null); }}
          title="Issue Record Details"
          size="lg"
        >
          {selectedIssue && (
            <div className="space-y-6">
              {/* Book Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Book Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.bookTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.bookAuthor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Copy ID</label>
                    <p className="text-gray-900 dark:text-white font-mono">{selectedIssue.copyId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Book ID</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.bookId}</p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.userEmail || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User ID</label>
                    <p className="text-gray-900 dark:text-white">{selectedIssue.userId}</p>
                  </div>
                </div>
              </div>

              {/* Issue Timeline */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Issue Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedIssue.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <p className={selectedIssue.isOverdue && !selectedIssue.returnDate ? "text-red-600 font-medium" : "text-gray-900 dark:text-white"}>
                      {new Date(selectedIssue.dueDate).toLocaleDateString()}
                      {selectedIssue.isOverdue && !selectedIssue.returnDate && (
                        <span className="text-xs block text-red-600">Overdue</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Return Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedIssue.returnDate ? new Date(selectedIssue.returnDate).toLocaleDateString() : 'Not returned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  {selectedIssue.returnDate ? (
                    <Badge variant="success" size="md">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Returned
                    </Badge>
                  ) : selectedIssue.isOverdue ? (
                    <Badge variant="danger" size="md">
                      <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                      Overdue
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="md">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!selectedIssue.returnDate && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={<ArrowUturnLeftIcon className="w-4 h-4" />}
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowReturnModal(true);
                      }}
                    >
                      Mark as Returned
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<TrashIcon className="w-4 h-4" />}
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete Record
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default IssueManagement;