"use client";
import React from "react";
import { Button } from "@/components/Button";

export const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        Analysis Error
      </h3>
      <p className="text-red-300">{error}</p>
      <Button onClick={onRetry} className="mt-3">
        Retry Analysis
      </Button>
    </div>
  );
};
