'use client';
import React from 'react';

export const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  disabled = false, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white disabled:bg-blue-300 disabled:cursor-not-allowed",
    secondary: "bg-neutral-600 hover:bg-neutral-700 text-white disabled:bg-neutral-400 disabled:cursor-not-allowed"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;