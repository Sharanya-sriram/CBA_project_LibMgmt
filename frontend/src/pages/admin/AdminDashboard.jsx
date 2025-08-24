import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import api from "../../api/http-common.js";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  // Mock admin statistics
  const [stats, setStats] = useState({
    totalBooks: 1250,
    totalUsers: 450,
    issuedBooks: 285,
    overdueBooks: 23,
    newUsersThisMonth: 45,
    newBooksThisMonth: 32,
    popularGenres: [
      { genre: "Fiction", count: 156, change: "+12%" },
      { genre: "Science", count: 89, change: "+8%" },
      { genre: "History", count: 67, change: "-3%" },
      { genre: "Biography", count: 45, change: "+15%" }
    ],
    recentActivity: [
      { type: "book_issued", user: "Alice Johnson", book: "The Great Gatsby", time: "10 minutes ago" },
      { type: "book_returned", user: "Bob Smith", book: "1984", time: "25 minutes ago" },
      { type: "user_registered", user: "Carol Davis", time: "1 hour ago" },
      { type: "book_added", book: "The Midnight Library", time: "2 hours ago" },
      { type: "overdue_alert", user: "David Wilson", book: "To Kill a Mockingbird", time: "3 hours ago" }
    ],
    systemHealth: {
      serverStatus: "healthy",
      databaseStatus: "healthy",
      backupStatus: "completed",
      lastBackup: "2024-01-15T08:00:00Z"
    }
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from backend APIs
        const [booksResponse, usersResponse, issuedBooksResponse] = await Promise.all([
          api.getBooks(),
          api.getUsers(),
          api.getIssuedBooks()
        ]);
        
        const books = booksResponse.data;
        const users = usersResponse.data;
        const issuedBooks = issuedBooksResponse.data;
        
        // Calculate real statistics
        const totalBooks = books.length;
        const totalUsers = users.length;
        const activeIssuedBooks = issuedBooks.filter(book => !book.returnDate);
        const overdueBooks = activeIssuedBooks.filter(book => {
          const issueDate = new Date(book.issueDate);
          const dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + 30); // 30 day loan period
          return new Date() > dueDate;
        });
        
        // Calculate available copies
        const totalCopies = books.reduce((sum, book) => sum + (book.copies?.length || 0), 0);
        const availableCopies = books.reduce((sum, book) => 
          sum + (book.copies?.filter(copy => copy.available).length || 0), 0);
        
        // Genre statistics
        const genreStats = books.reduce((acc, book) => {
          acc[book.genre] = (acc[book.genre] || 0) + 1;
          return acc;
        }, {});
        
        const popularGenres = Object.entries(genreStats)
          .map(([genre, count]) => ({
            genre,
            count,
            change: `+${Math.floor(Math.random() * 20)}%` // Mock change data
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);
        
        // Generate recent activity from issued books
        const recentActivity = issuedBooks
          .slice(-5)
          .reverse()
          .map(issuedBook => {
            const book = books.find(b => b.id === issuedBook.bookId);
            const user = users.find(u => u.id === issuedBook.userId);
            
            return {
              type: issuedBook.returnDate ? "book_returned" : "book_issued",
              user: user?.name || `User ${issuedBook.userId}`,
              book: book?.title || `Book ${issuedBook.bookId}`,
              time: getTimeAgo(issuedBook.returnDate || issuedBook.issueDate)
            };
          });
        
        setStats({
          totalBooks,
          totalUsers,
          issuedBooks: activeIssuedBooks.length,
          overdueBooks: overdueBooks.length,
          newUsersThisMonth: Math.floor(totalUsers * 0.1), // Mock: 10% new users
          newBooksThisMonth: Math.floor(totalBooks * 0.05), // Mock: 5% new books
          popularGenres,
          recentActivity,
          systemHealth: {
            serverStatus: "healthy",
            databaseStatus: "healthy",
            backupStatus: "completed",
            lastBackup: new Date().toISOString()
          }
        });
        
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/20',
        text: 'text-indigo-600 dark:text-indigo-400'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/20', 
        text: 'text-emerald-600 dark:text-emerald-400'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400'  
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400'
      }
    };
    return colorMap[color] || colorMap.indigo;
  };

  const StatCard = ({ icon: Icon, title, value, change, changeType, color, action,todo=null }) => {
    const colorClasses = getColorClasses(color);
    
    return (
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`w-5 h-5 ${colorClasses.text}`} />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              {change && (
                <div className={`flex items-center gap-1 ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{change}</span>
                </div>
              )}
            </div>
            
            {action && (
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button size="sm" variant="outline" className="text-xs" onClick={todo}>
                  {action}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case "book_issued":
          return <BookOpenIcon className="w-4 h-4 text-blue-500" />;
        case "book_returned":
          return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />;
        case "user_registered":
          return <UserGroupIcon className="w-4 h-4 text-purple-500" />;
        case "book_added":
          return <SparklesIcon className="w-4 h-4 text-indigo-500" />;
        case "overdue_alert":
          return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
        default:
          return <ClockIcon className="w-4 h-4 text-gray-500" />;
      }
    };

    const getDescription = () => {
      switch (activity.type) {
        case "book_issued":
          return `${activity.user} issued "${activity.book}"`;
        case "book_returned":
          return `${activity.user} returned "${activity.book}"`;
        case "user_registered":
          return `${activity.user} joined the library`;
        case "book_added":
          return `New book "${activity.book}" added to catalog`;
        case "overdue_alert":
          return `${activity.user} has overdue book "${activity.book}"`;
        default:
          return "System activity";
      }
    };

    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white">{getDescription()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
        </div>
      </div>
    );
  };

  const QuickAction = ({ icon: Icon, title, description, action, color = "indigo", onClick }) => {
    const colorClasses = getColorClasses(color);
    
    return (
      <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colorClasses.bg} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📊 Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.username}! Here's what's happening in your library.
              </p>
            </div>
            
            
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpenIcon}
            title="Total Books"
            value={stats.totalBooks.toLocaleString()}
            change="+5.2%"
            changeType="positive"
            color="indigo"
            action="Manage Books"
            todo={()=>navigate("/admin/books")}
          />
          <StatCard
            icon={UserGroupIcon}
            title="Active Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12.3%"
            changeType="positive"
            color="emerald"
            action="View Users"
            todo={()=>navigate("/admin/users")}

          />
          <StatCard
            icon={ClockIcon}
            title="Books Issued"
            value={stats.issuedBooks}
            change="-2.1%"
            changeType="negative"
            color="amber"
            action="Issue Management"
            todo={()=>navigate("/admin/issues")}
          />
          <StatCard
            icon={ExclamationTriangleIcon}
            title="Overdue Books"
            value={stats.overdueBooks}
            change="+8.7%"
            changeType="negative"
            color="red"
            action="Send Reminders"
            todo={()=>navigate("/admin/users")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Genres */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  📚 Popular Genres
                </h2>
                
              </div>
              
              <div className="space-y-4">
                {stats.popularGenres.map((genre, index) => (
                  <div key={genre.genre} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{genre.genre}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{genre.count} books issued</p>
                      </div>
                    </div>
                    
                    <Badge variant={genre.change.startsWith('+') ? "success" : "danger"} size="sm">
                      {genre.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                ⚡ Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  icon={BookOpenIcon}
                  title="Add New Book"
                  description="Add books to the catalog"
                  color="indigo"
                  onClick={() => navigate('/admin/books')}
                />
                <QuickAction
                  icon={UserGroupIcon}
                  title="Register User"
                  description="Add new library member"
                  color="emerald"
                  onClick={() => navigate('/admin/users')}
                />
                <QuickAction
                  icon={ClockIcon}
                  title="Issue Book"
                  description="Issue book to member"
                  color="amber"
                  onClick={() => navigate('/admin/issues')}
                />
                <QuickAction
                  icon={ChartBarIcon}
                  title="View Reports"
                  description="Generate detailed reports"
                  color="purple"
                  onClick={() => navigate('/admin/reports')}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* System Status */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🔧 System Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server</span>
                  <Badge variant="success" size="sm">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <Badge variant="success" size="sm">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(stats.systemHealth.lastBackup).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  📊 Recent Activity
                </h3>
                
              </div>
              
              <div className="space-y-1">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </Card>

            {/* Monthly Stats */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📈 This Month
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">New Books</span>
                  </div>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.newBooksThisMonth}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">New Users</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.newUsersThisMonth}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;