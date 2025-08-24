import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { UserIcon, LockClosedIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user, authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in and auth check finished
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/home");
    }
  }, [user, authLoading, navigate]);

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
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show nothing until auth check is complete
  if (authLoading) return null;

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
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-200">
            <AcademicCapIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            LibraryHub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Your Digital Library Portal</p>
        </div>

        <Card padding="lg" shadow="xl" className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Welcome Back! 👋</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Sign in to access your library</p>
            </div>

            {error && <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg text-red-800">{error}</div>}

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

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
