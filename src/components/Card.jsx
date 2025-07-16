"use client";
import React from "react";
import clsx from "clsx";

export const Card = ({ title, children, className = "" }) => {
  const cardClasses = clsx(
    "bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg p-8 h-full",
    className
  );
  return (
    <div className={cardClasses}>
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-neutral-200">{title}</h2>
      )}
      {children}
    </div>
  );
};
