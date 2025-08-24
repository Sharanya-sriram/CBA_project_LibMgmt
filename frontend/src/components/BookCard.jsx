import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import Card from "./common/Card";
import Badge from "./common/Badge";
import Button from "./common/Button";

const BookCard = ({ book, showActions = true, className = "" }) => {
  const { darkMode } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for demo - replace with actual book data
  const bookData = {
    id: book?.id || 1,
    title: book?.title || "Sample Book Title",
    author: book?.author || "Unknown Author",
    genre: book?.genre || "Fiction",
    publicationDate: book?.publicationDate || "2023-01-01",
    description: book?.description || "A wonderful book description...",
    copies: book?.copies || [{ available: true }, { available: false }],
    rating: book?.rating || 4.5,
    totalCopies: book?.copies?.length || 2
  };
  const availableCopies = bookData.copies?.filter(copy => Number(copy.available) === 1).length || 0;
  bookData.copies
  const isAvailable = availableCopies > 0;
  

  const handleViewDetails = () => {
    navigate(`/book/${bookData.id}`);
  };


  // Generate book cover colors based on genre
  const getCoverColor = (genre) => {
    const colors = {
      'Classic': 'from-yellow-600 to-amber-700',
      'Dystopian': 'from-gray-700 to-gray-900',
      'Romance': 'from-rose-500 to-pink-600',
      'Adventure': 'from-blue-500 to-cyan-600',
      'Historical': 'from-amber-500 to-orange-600',
      'Fantasy': 'from-purple-500 to-indigo-600',
      'Psychological': 'from-emerald-600 to-teal-700',
      'Philosophical': 'from-indigo-600 to-sky-700',
      'Political Satire': 'from-red-500 to-orange-600',
      'Thriller': 'from-gray-800 to-black',
      'Drama': 'from-pink-600 to-purple-600',
      'Horror': 'from-red-700 to-black',
      'default': 'from-indigo-500 to-blue-600'
    };
    return colors[genre] || colors.default;
  };
  

  return (
    <Card 
      hover={true} 
      className={`group cursor-pointer ${className}`}
      onClick={handleViewDetails}
    >
      {/* Book Cover */}
      <div className={`relative h-48 rounded-lg bg-gradient-to-br ${getCoverColor(bookData.genre)} mb-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpenIcon className="w-16 h-16 text-white/80" />
        </div>
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isAvailable ? "success" : "danger"} 
            size="sm"
            className="font-bold"
          >
            {isAvailable ? `${availableCopies} Available` : "Out of Stock"}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white text-sm font-medium">{bookData.rating}</span>
        </div>
      </div>

      {/* Book Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
            {bookData.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <UserIcon className="w-4 h-4" />
            <span className="font-medium">{bookData.author}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="primary" size="sm">
            {bookData.genre}
          </Badge>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-3 h-3" />
            <span>{new Date(bookData.publicationDate).getFullYear()}</span>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {bookData.description}
        </p>

        {/* Actions */}
        {showActions && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
              
              
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2">
          <span>{bookData.totalCopies} total copies</span>
          <span className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
