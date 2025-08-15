import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  shadow = 'sm',
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const hoverEffect = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;