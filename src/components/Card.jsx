'use client';
import React from "react";

export const Card = ({ title, children }) => {
  return (
    <div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg p-8 h-full">
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-neutral-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
