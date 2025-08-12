import { useState } from "react";
import BookList from "../components/BookList";
import UserList from "../components/UserList";
import IssuedBooksList from "../components/IssuedBooksList";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("books");
  const { darkMode } = useAuth();

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

  return (
    <>
    <Navbar />
    <div className={`flex h-screen ${bgClass}`}>
      {/* Sidebar */}
      <aside className={`w-64 p-4 border-r ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("books")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "books" ? "bg-blue-500 text-white" : "hover:bg-blue-100 dark:hover:bg-gray-800"
            }`}
          >
            📚 Books
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-blue-100 dark:hover:bg-gray-800"
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab("issued")}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "issued" ? "bg-blue-500 text-white" : "hover:bg-blue-100 dark:hover:bg-gray-800"
            }`}
          >
            📦 Issued Books
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "books" && <BookList />}
        {activeTab === "users" && <UserList />}
        {activeTab === "issued" && <IssuedBooksList />}
      </main>
    </div>
    </>
  );
}
