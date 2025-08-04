import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user and token
    navigate("/"); // Go to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="brand">📘 LibManage</h2>
        <NavLink to="/home" className="nav-link">Home</NavLink>
        <NavLink to="/mybooks" className="nav-link">My Books</NavLink>
      </div>
      <div className="navbar-right">
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
