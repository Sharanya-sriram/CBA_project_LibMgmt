import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import api from "../../api/http-common.js";

// UserForm component moved outside to prevent re-creation
const UserForm = React.memo(({ title, userForm, onFormChange, onSubmit, onCancel }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Full Name"
        value={userForm.name}
        onChange={(e) => onFormChange('name', e.target.value)}
        placeholder="Enter full name"
        required
      />
      <Input
        label="Username"
        value={userForm.username}
        onChange={(e) => onFormChange('username', e.target.value)}
        placeholder="Enter username"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Email"
        type="email"
        value={userForm.email}
        onChange={(e) => onFormChange('email', e.target.value)}
        placeholder="Enter email address"
      />
      <Input
        label={title === "Edit User" ? "New Password (leave blank to keep current)" : "Password"}
        type="password"
        value={userForm.password}
        onChange={(e) => onFormChange('password', e.target.value)}
        placeholder="Enter password"
        required={title !== "Edit User"}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        label="Age"
        type="number"
        value={userForm.age}
        onChange={(e) => onFormChange('age', e.target.value)}
        placeholder="Enter age"
      />
      <Input
        label="College"
        value={userForm.college}
        onChange={(e) => onFormChange('college', e.target.value)}
        placeholder="Enter college name"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Role
        </label>
        <select
          value={userForm.role}
          onChange={(e) => onFormChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

    <div className="flex gap-3 pt-4">
      <Button variant="primary" onClick={onSubmit} className="flex-1">
        {title === "Add New User" ? "Add User" : "Update User"}
      </Button>
      <Button variant="outline" onClick={onCancel} className="flex-1">
        Cancel
      </Button>
    </div>
  </div>
));

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Form state for add/edit user
  const [userForm, setUserForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    age: "",
    college: "",
    role: "user"
  });

  // Memoized form handlers to prevent cursor issues
  const handleFormChange = useCallback((field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = useCallback(async () => {
    try {
      const userData = {
        ...userForm,
        age: userForm.age ? parseInt(userForm.age) : null
      };
      
      await api.addUser(userData);
      await fetchUsers();
      
      setShowAddModal(false);
      resetForm();
      alert("✅ User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
      alert("❌ Failed to add user. Please try again.");
    }
  }, [userForm]);

  const handleEditUser = useCallback(async () => {
    try {
      const userData = {
        ...userForm,
        age: userForm.age ? parseInt(userForm.age) : null
      };
      
      // Don't send password if it's empty (keep existing password)
      if (!userData.password) {
        delete userData.password;
      }
      
      await api.updateUser(selectedUser._id, userData);
      await fetchUsers();
      
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      alert("✅ User updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("❌ Failed to update user. Please try again.");
    }
  }, [userForm, selectedUser]);

  const handleDeleteUser = async () => {
    try {
      await api.deleteUser(selectedUser._id);
      await fetchUsers();
      
      setShowDeleteModal(false);
      setSelectedUser(null);
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("❌ Failed to delete user. Please try again.");
    }
  };

  const resetForm = useCallback(() => {
    setUserForm({
      name: "",
      username: "",
      password: "",
      email: "",
      age: "",
      college: "",
      role: "user"
    });
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      username: user.username,
      password: "", // Don't pre-fill password
      email: user.email || "",
      age: user.age?.toString() || "",
      college: user.college || "",
      role: user.role
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const UserRow = ({ user, index }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {user.email || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {user.age || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {user.college || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge 
          variant={user.role === "admin" ? "success" : "primary"} 
          size="sm"
          icon={user.role === "admin" ? <ShieldCheckIcon className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
        >
          {user.role}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          
          <Button 
            size="sm" 
            variant="outline" 
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={() => openEditModal(user)}
          >
            Edit
          </Button>
          {user._id !== currentUser._id && (
            <Button
              size="sm"
              variant="danger"
              icon={<TrashIcon className="w-4 h-4" />}
              onClick={() => openDeleteModal(user)}
            >
              Delete
            </Button>
          )}
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
                👥 User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage library users and their access levels
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon={<PlusIcon className="w-4 h-4" />}
                onClick={() => setShowAddModal(true)}
              >
                Add User
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
                  placeholder="Search by name, username, or email..."
                  size="md"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === "admin").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Administrators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {users.filter(u => u.role === "user").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Regular Users</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <UserRow key={user.id} user={user} index={index} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add User Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="Add New User"
          size="lg"
        >
          <UserForm
            title="Add New User"
            userForm={userForm}
            onFormChange={handleFormChange}
            onSubmit={handleAddUser}
            onCancel={() => { setShowAddModal(false); resetForm(); }}
          />
        </Modal>

        {/* Edit User Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }}
          title="Edit User"
          size="lg"
        >
          <UserForm
            title="Edit User"
            userForm={userForm}
            onFormChange={handleFormChange}
            onSubmit={handleEditUser}
            onCancel={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedUser(null); }}
          title="Delete User"
        >
          {selectedUser && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete user "<strong>{selectedUser.name}</strong>"?
              </p>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone. All user data and book history will be permanently deleted.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button variant="danger" onClick={handleDeleteUser} className="flex-1">
                  Delete User
                </Button>
                <Button variant="outline" onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }} className="flex-1">
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

export default UserManagement;