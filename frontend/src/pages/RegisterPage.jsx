import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { UserIcon, LockClosedIcon, AtSymbolIcon, AcademicCapIcon, UserPlusIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    college: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const success = await register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        college: formData.college,
        role: 'user' // Default role for self-registration
      });

      if (success) {
        navigate("/login");
      } else {
        setError("Registration failed. Username or email may already exist.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">📚</div>
        <div className="absolute top-20 right-20 text-4xl">📖</div>
        <div className="absolute bottom-20 left-20 text-5xl">📗</div>
        <div className="absolute bottom-10 right-10 text-4xl">📘</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">📙</div>
        <div className="absolute top-1/3 right-1/3 text-5xl">📕</div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-200">
            <UserPlusIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join LibraryHub
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create your library account
          </p>
        </div>

        {/* Registration Form */}
        <Card padding="lg" shadow="xl" className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Create Account 🚀
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                Fill in your details to get started
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<UserIcon className="w-5 h-5" />}
                required
                disabled={loading}
              />

              <Input
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                icon={<UserIcon className="w-5 h-5" />}
                required
                disabled={loading}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<AtSymbolIcon className="w-5 h-5" />}
                required
                disabled={loading}
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                icon={<PhoneIcon className="w-5 h-5" />}
                required
                disabled={loading}
                min="16"
                max="100"
              />

              <Input
                label="College/Institution"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                icon={<AcademicCapIcon className="w-5 h-5" />}
                required
                disabled={loading}
              />

              <div></div> {/* Empty div for grid spacing */}

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={<LockClosedIcon className="w-5 h-5" />}
                required
                disabled={loading}
                minLength="6"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={<LockClosedIcon className="w-5 h-5" />}
                required
                disabled={loading}
                minLength="6"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
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

export default RegisterPage;