import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './index.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyBooks from "./pages/MyBooks.jsx";
import MainLayout from "./components/MainLayout.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import BookCatalog from "./pages/BookCatalog.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import BooksManagement from "./pages/admin/BooksManagement.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import IssueManagement from "./pages/admin/IssueManagement.jsx";
import CopyManagement from "./pages/admin/CopyManagement.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* User Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<BooksManagement />} />
            <Route path="/admin/copies" element={<CopyManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/reports" element={<div className="p-8 text-center">Reports - Coming Soon</div>} />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
