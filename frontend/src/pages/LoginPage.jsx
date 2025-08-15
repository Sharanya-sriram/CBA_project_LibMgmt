import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { BookOpenIcon, UserIcon, LockClosedIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/home");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">📚</div>
        <div className="absolute top-20 right-20 text-4xl">📖</div>
        <div className="absolute bottom-20 left-20 text-5xl">📗</div>
        <div className="absolute bottom-10 right-10 text-4xl">📘</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">📙</div>
        <div className="absolute top-1/3 right-1/3 text-5xl">📕</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-200">
            <AcademicCapIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            LibraryHub
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Your Digital Library Portal
          </p>
        </div>

        {/* Login Form */}
        <Card padding="lg" shadow="xl" className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Sign in to access your library
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              icon={<UserIcon className="w-5 h-5" />}
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<LockClosedIcon className="w-5 h-5" />}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In to Library"}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-200 dark:border-gray-600">
            <div className="flex items-center mb-3">
              <BookOpenIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                Demo Credentials
              </p>
            </div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300 space-y-2">
              <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span className="font-medium">User:</span>
                <span>user1 / user1</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                <span className="font-medium">Admin:</span>
                <span>user2 / user2</span>
              </div>
            </div>
          </div>

        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 LibraryHub. Empowering knowledge management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
