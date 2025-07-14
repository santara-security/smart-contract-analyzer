import { useState, useEffect, useCallback, useRef } from 'react';

export const useAuditAnalysis = (chain, contractAddress) => {
  const [analysisData, setAnalysisData] = useState(null);
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
      const response = await fetch(`/api/audit?tokenAddress=${contractAddress}&chain=${chain}`, {
        signal: controller.signal
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze token");
      }

      setAnalysisData(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
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
    retry
  };
};
