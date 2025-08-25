// src/components/Navbar.jsx
import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition transform duration-200";
  const active = darkMode
    ? "bg-yellow-400/10 text-yellow-300 scale-105"
    : "bg-indigo-600/10 text-indigo-600 scale-105";
  const inactive = darkMode
    ? "text-gray-300 hover:text-white hover:scale-105"
    : "text-gray-700 hover:text-indigo-700 hover:scale-105";

  const navbarBg = darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";
  const buttonBg = darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300";

  return (
    <header className={`${navbarBg} shadow-lg transition-colors duration-500`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-extrabold tracking-tight bg-clip-text text-transparent 
                ${darkMode ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}
              >
                📘
              </div>
              <div className="font-semibold text-lg">LibManage</div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/home"
                className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/mybooks"
                className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
              >
                My Books
              </NavLink>
            </div>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            

            {user && (
              <button
                onClick={handleLogout}
                className={`hidden sm:inline-flex px-4 py-2 rounded-lg font-medium transform hover:-translate-y-0.5 transition 
                ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                Logout
              </button>
            )}

            {/* mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen((v) => !v)}
                className={`p-2 rounded-md ${buttonBg}`}
                aria-label="Toggle menu"
              >
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-40 mt-2" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 pb-2">
            <NavLink
              to="/home"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded ${isActive ? active : inactive}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/mybooks"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `px-3 py-2 rounded ${isActive ? active : inactive}`}
            >
              My Books
            </NavLink>
            {user && (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className={`w-full text-left px-3 py-2 rounded 
                ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
