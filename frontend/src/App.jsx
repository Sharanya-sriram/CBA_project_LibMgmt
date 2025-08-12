import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyBooks from "./pages/MyBooks.jsx";
import MainLayout from "./components/MainLayout.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/mybooks"
            element={<MyBooks />}
          />
          <Route
            path="/book/:id"
            element={<BookDetails />}
          />
          
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
