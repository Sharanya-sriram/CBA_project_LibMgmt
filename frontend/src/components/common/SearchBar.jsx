import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-4 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
          transition-all duration-200
          ${sizes[size]}
        `}
      />
    </div>
  );
};

export default SearchBar;