import { NavLink } from "react-router-dom";
import "../styles//Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="brand">📘 LibManage</h2>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/mybooks" className="nav-link">My Books</NavLink>
      </div>
      <div className="navbar-right">
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
