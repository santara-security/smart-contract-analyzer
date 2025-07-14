"use client";
import React from "react";
import { Button } from "@/components/Button";

export const ActionButtons = ({ 
  loading, 
  onReanalyze, 
  onNewAnalysis 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-700">
      <Button
        onClick={onReanalyze}
        disabled={loading}
        className="flex-1"
      >
        {loading ? "Analyzing..." : "Re-analyze Contract"}
      </Button>
      <Button
        onClick={onNewAnalysis}
        variant="secondary"
        className="flex-1"
      >
        Analyze New Contract
      </Button>
    </div>
  );
};
