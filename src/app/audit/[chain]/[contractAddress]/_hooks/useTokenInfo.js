"use client";
import { useState, useEffect, useCallback } from "react";

export const useTokenInfo = (chain, contractAddress) => {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTokenInfo = useCallback(async () => {
    if (!chain || !contractAddress) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/token?tokenAddress=${contractAddress}&chain=${chain}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch token information");
      }

      // The API returns the token data directly, not wrapped in a data property
      setTokenData(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chain, contractAddress]);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  const retry = useCallback(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);
  return {
    tokenData,
    loading,
    error,
    retry,
  };
};
