import { useState, useEffect, useContext } from "react";
import api from "../api/http-common";
import { AuthContext } from "../context/AuthContext"; // adjust path

export default function UserList() {
  const { darkMode } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    age: "",
    college: "",
    email: "",
    role: "user"
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.getUsers("/users");
    setUsers(res.data);
  };

  const handleAddUser = async () => {
    await api.addUser(newUser);
    setIsAdding(false);
    setNewUser({
      name: "",
      username: "",
      password: "",
      age: "",
      college: "",
      email: "",
      role: "user"
    });
    fetchUsers();
  };

  const handleUpdateUser = async () => {
    await api.updateUser(`${editingUser.id}`, editingUser);
    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteUser = async (id) => {
    await api.deleteUser(`${id}`);
    fetchUsers();
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">👥 Users</h2>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className={`px-4 py-2 rounded ${
            darkMode
              ? "bg-green-600 hover:bg-green-500"
              : "bg-green-500 hover:bg-green-400 text-white"
          }`}
        >
          ➕ Add User
        </button>
      )}

      {isAdding && (
        <div
          className={`p-4 mt-4 rounded ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="text-lg font-bold mb-2">Add New User</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="number"
              placeholder="Age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="text"
              placeholder="College"
              value={newUser.college}
              onChange={(e) =>
                setNewUser({ ...newUser, college: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className={`p-2 rounded col-span-2 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddUser}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-blue-500 hover:bg-blue-400 text-white"
              }`}
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-500 hover:bg-gray-400"
                  : "bg-gray-300 hover:bg-gray-200 text-black"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full border border-gray-700">
          <thead>
            <tr className={darkMode ? "bg-gray-800" : "bg-gray-200"}>
              <th className="p-2 border border-gray-700">Name</th>
              <th className="p-2 border border-gray-700">Username</th>
              <th className="p-2 border border-gray-700">Email</th>
              <th className="p-2 border border-gray-700">Role</th>
              <th className="p-2 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className={darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}
              >
                <td className="p-2 border border-gray-700">{u.name}</td>
                <td className="p-2 border border-gray-700">{u.username}</td>
                <td className="p-2 border border-gray-700">{u.email}</td>
                <td className="p-2 border border-gray-700">{u.role}</td>
                <td className="p-2 border border-gray-700 space-x-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className={`px-2 py-1 rounded ${
                      darkMode
                        ? "bg-yellow-600 hover:bg-yellow-500"
                        : "bg-yellow-400 hover:bg-yellow-300 text-black"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className={`px-2 py-1 rounded ${
                      darkMode
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-red-500 hover:bg-red-400 text-white"
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`p-6 rounded shadow-lg w-96 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-bold mb-2">Edit User</h3>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className={`p-2 rounded mb-2 w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="text"
              value={editingUser.username}
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
              className={`p-2 rounded mb-2 w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className={`p-2 rounded mb-2 w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className={`p-2 rounded mb-2 w-full ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateUser}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-500 hover:bg-gray-400"
                    : "bg-gray-300 hover:bg-gray-200 text-black"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
