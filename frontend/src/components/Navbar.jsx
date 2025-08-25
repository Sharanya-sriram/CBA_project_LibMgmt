import { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import Badge from "./common/Badge";

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

  const linkBase = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105";
  const active = darkMode
    ? "bg-indigo-600/20 text-indigo-300 shadow-lg scale-105"
    : "bg-indigo-600/10 text-indigo-600 shadow-md scale-105";
  const inactive = darkMode
    ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
    : "text-gray-700 hover:text-indigo-700 hover:bg-gray-100";

  const navbarBg = darkMode ? "bg-gray-900/95 backdrop-blur text-gray-100" : "bg-white/95 backdrop-blur text-gray-900";

  // Navigation items based on user role
  const userNavItems = [
    { to: "/home", icon: HomeIcon, label: "Dashboard" },
    { to: "/catalog", icon: BookOpenIcon, label: "Book Catalog" },
    { to: "/mybooks", icon: AcademicCapIcon, label: "My Books" },
    { to: "/profile", icon: UserGroupIcon, label: "Profile" }
  ];

  const adminNavItems = [
    { to: "/admin/dashboard", icon: ChartBarIcon, label: "Dashboard" },
    { to: "/admin/books", icon: BookOpenIcon, label: "Manage Books" },
    { to: "/admin/users", icon: UserGroupIcon, label: "Manage Users" },
    { to: "/admin/issues", icon: AcademicCapIcon, label: "Issue Management" },
    { to: "/admin/reports", icon: ChartBarIcon, label: "Reports" }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <header className={`${navbarBg} shadow-xl border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LibraryHub
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            
            

            {/* User Badge */}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{user.username}</div>
                  <Badge variant={user.role === 'admin' ? 'success' : 'primary'} size="sm">
                    {user.role}
                  </Badge>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-indigo-500" />
              )}
            </button>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  darkMode 
                    ? "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30" 
                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Toggle menu"
              >
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-gray-200/20 dark:border-gray-700/20">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            
            {user && (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  darkMode 
                    ? "bg-red-600/20 hover:bg-red-600/30 text-red-400" 
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
