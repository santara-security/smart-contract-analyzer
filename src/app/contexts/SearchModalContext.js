"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";

const SearchModalContext = createContext();

export function SearchModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const {
    data: latestTokens,
    isLoading: loadingLatestTokens,
    refetch: refetchLatestTokens,
  } = useQuery({
    queryKey: ["latestTokens"],
    queryFn: async () => {
      const response = await fetch("/api/tokens/latest?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch latest tokens");
      }
      return response.json();
    },
    enabled: false, // Only fetch when explicitly called
  });

  // Function to open modal
  const openModal = () => {
    console.log('Opening search modal...');
    refetchLatestTokens();
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    console.log('Closing search modal...');
    setShowModal(false);
    setSearchInput("");
    setSearchResults([]);
  };

  // Function to search tokens from OKX API
  const searchTokens = async (query) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setSearchLoading(true);
      const response = await fetch(
        `https://web3.okx.com/priapi/v1/dx/trade/multi/tokens/single/search?inputContent=${encodeURIComponent(
          query
        )}`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }

      const r = await response.json();
      const selectedChainIds = [1, 8453];

      if (r.data.systemList.length > 0) {
        const x = r.data.systemList
          .filter((i) => selectedChainIds.includes(i.chainId))
          .slice(0, 5);
        setSearchResults(x);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error searching tokens:", error);
        setSearchResults([]);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Effect for handling token search with debouncing
  useEffect(() => {
    if (!searchInput || searchInput.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchTokens(searchInput);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchInput]);

  // Keyboard shortcut: Ctrl+K to open modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        console.log('Ctrl+K pressed, opening modal...');
        openModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = {
    showModal,
    openModal,
    closeModal,
    searchInput,
    setSearchInput,
    searchResults,
    searchLoading,
    latestTokens,
    loadingLatestTokens,
  };

  console.log('SearchModalProvider rendered, showModal:', showModal);

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
}

// Hook for using the search modal context
export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (!context) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}
