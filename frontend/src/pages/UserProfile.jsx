import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useParams } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CalendarIcon,
  PencilIcon,
  KeyIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import Card from "../components/common/Card.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import Modal from "../components/common/Modal.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import api from "../api/http-common.js";

const UserProfile = () => {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    age: "",
    college: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const userId = id || currentUser.id; // Use URL param if available, otherwise current user

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user details
      const userResponse = await api.getUser(userId);
      const userData = userResponse.data;
      setUser(userData);
      
      // Set edit form data
      setEditForm({
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age?.toString() || "",
        college: userData.college || ""
      });

      // Fetch user's issued books
      try {
        const issuedBooksResponse = await api.getIssuedBooks();
        const userIssuedBooks = issuedBooksResponse.data.filter(
          issue => issue.userId === parseInt(userId)
        );
        
        // Enrich with book details
        const booksWithDetails = await Promise.all(
          userIssuedBooks.map(async (issue) => {
            try {
              const bookResponse = await api.getBook(issue.bookId);
              return {
                ...issue,
                bookTitle: bookResponse.data.title,
                bookAuthor: bookResponse.data.author,
                dueDate: calculateDueDate(issue.issueDate)
              };
            } catch (error) {
              return {
                ...issue,
                bookTitle: `Book ID ${issue.bookId}`,
                bookAuthor: "Unknown",
                dueDate: calculateDueDate(issue.issueDate)
              };
            }
          })
        );
        
        setUserBooks(booksWithDetails);
      } catch (error) {
        console.error("Failed to fetch user books:", error);
        setUserBooks([]);
      }

    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Fallback for current user if API fails
      if (userId === currentUser.id) {
        setUser(currentUser);
        setEditForm({
          name: currentUser.name || "",
          email: currentUser.email || "",
          age: currentUser.age?.toString() || "",
          college: currentUser.college || ""
        });
      }
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

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  const handleEditProfile = async () => {
    try {
      const updateData = {
        ...user,
        name: editForm.name,
        email: editForm.email,
        age: editForm.age ? parseInt(editForm.age) : null,
        college: editForm.college
      };

      await api.updateUser(userId, updateData);
      await fetchUserData();
      
      setShowEditModal(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("❌ Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("❌ New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("❌ Password must be at least 6 characters long!");
      return;
    }

    try {
      // Note: In a real app, you'd verify current password
      const updateData = {
        ...user,
        password: passwordForm.newPassword
      };

      await api.updateUser(userId, updateData);
      
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("✅ Password changed successfully!");
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("❌ Failed to change password. Please try again.");
    }
  };

  const resetForms = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age?.toString() || "",
      college: user?.college || ""
    });
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="text-center p-8">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested user profile could not be found.</p>
        </Card>
      </div>
    );
  }

  const isOwnProfile = parseInt(userId) === currentUser.id;
  const currentBooks = userBooks.filter(book => !book.returnDate);
  const bookHistory = userBooks.filter(book => book.returnDate);
  const overdueBooks = currentBooks.filter(book => isOverdue(book.dueDate));

  return (
    <div className="transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👤 {isOwnProfile ? "My Profile" : `${user.name}'s Profile`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isOwnProfile ? "Manage your account information and view your library activity" : "View user information and library activity"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                
                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{user.username}</p>
                
                {/* Role Badge */}
                <Badge 
                  variant={user.role === "admin" ? "success" : "primary"} 
                  size="md"
                  icon={user.role === "admin" ? <ShieldCheckIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  className="mb-6"
                >
                  {user.role === "admin" ? "Administrator" : "Library Member"}
                </Badge>

                {/* Action Buttons - Only for own profile */}
                {isOwnProfile && (
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      icon={<PencilIcon className="w-4 h-4" />}
                      onClick={() => setShowEditModal(true)}
                      className="w-full"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      icon={<KeyIcon className="w-4 h-4" />}
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full"
                    >
                      Change Password
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.email}</span>
                  </div>
                )}
                
                {user.age && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.age} years old</span>
                  </div>
                )}
                
                {user.college && (
                  <div className="flex items-center gap-3">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{user.college}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Library Activity */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                    <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userBooks.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentBooks.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Currently Issued</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overdueBooks.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Current Books */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Currently Issued Books ({currentBooks.length})
              </h3>
              
              {currentBooks.length > 0 ? (
                <div className="space-y-3">
                  {currentBooks.map(book => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                          <BookOpenIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{book.bookTitle}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{book.bookAuthor}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Copy: {book.copyId} • Due: {new Date(book.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {isOverdue(book.dueDate) ? (
                        <Badge variant="danger" size="sm">Overdue</Badge>
                      ) : (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No books currently issued</p>
                </div>
              )}
            </Card>

            {/* Reading History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reading History ({bookHistory.length})
              </h3>
              
              {bookHistory.length > 0 ? (
                <div className="space-y-3">
                  {bookHistory.slice(0, 5).map(book => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{book.bookTitle}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{book.bookAuthor}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Returned: {new Date(book.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant="success" size="sm">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Returned
                      </Badge>
                    </div>
                  ))}
                  
                  {bookHistory.length > 5 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm pt-2">
                      ... and {bookHistory.length - 5} more books
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No reading history available</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); resetForms(); }}
          title="Edit Profile"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                value={editForm.age}
                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                placeholder="Enter your age"
              />
              <Input
                label="College"
                value={editForm.college}
                onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                placeholder="Enter your college"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="primary" onClick={handleEditProfile} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => { setShowEditModal(false); resetForms(); }} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => { setShowPasswordModal(false); resetForms(); }}
          title="Change Password"
        >
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />

            <div className="flex gap-3 pt-4">
              <Button variant="primary" onClick={handleChangePassword} className="flex-1">
                Change Password
              </Button>
              <Button variant="outline" onClick={() => { setShowPasswordModal(false); resetForms(); }} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserProfile;