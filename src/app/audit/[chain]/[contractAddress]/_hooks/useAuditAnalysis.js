"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export const useAuditAnalysis = (chain, contractAddress) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisSummary, setAnalysisSummary] = useState({
    high: 0,
    informational: 0,
    low: 0,
    medium: 0,
  });
  const [analysisScore, setAnalysisScore] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);
  const currentRequestRef = useRef(null);

  const analyzeToken = useCallback(async () => {
    if (!chain || !contractAddress || hasFetchedRef.current) return;

    // Cancel any existing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    currentRequestRef.current = controller;

    setLoading(true);
    setError(null);
    hasFetchedRef.current = true;

    try {
      const response = await fetch(
        `/api/audit?tokenAddress=${contractAddress}&chain=${chain}`,
        {
          signal: controller.signal,
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze token");
      }
      const summary = data?.result.results.detectors.reduce((acc, detector) => {
        const impact = detector.impact.toLowerCase();
        acc[impact] = (acc[impact] || 0) + 1;
        return acc;
      }, {});

      setAnalysisSummary((prev) => ({
        ...prev,
        ...summary,
      }));

      const score = Object.values(summary).reduce((sum, count, index) => {
        const weights = { high: 15, medium: 5, low: 2, informational: 0 };
        const impact = Object.keys(weights)[index];
        return sum + (count * (weights[impact] || 0));
      }, 0);
      const calculatedScore = Math.min(Math.max(100 - score, 0), 100);
      setAnalysisScore(calculatedScore);

      setAnalysisData(data);
    } catch (err) {
      console.error("Error fetching audit analysis:", err);
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      currentRequestRef.current = null;
    }
  }, [chain, contractAddress]);

  useEffect(() => {
    analyzeToken();

    // Cleanup function to abort request if component unmounts
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [analyzeToken]);

  const retry = useCallback(() => {
    hasFetchedRef.current = false;
    setError(null);
    setAnalysisData(null);
    analyzeToken();
  }, [analyzeToken]);

  return {
    analysisData,
    loading,
    error,
    retry,
    analysisSummary,
    analysisScore,
  };
};
