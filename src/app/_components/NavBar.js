"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchModal from "./SearchModal";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ShinyText from "./ShinyText";

export default function NavBar() {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const {
    data: latestTokens,
    isLoading: loadingLatestTokens,
    refetch,
  } = useQuery({
    queryKey: ["latestTokens"],
    queryFn: async () => {
      const response = await fetch("/api/tokens/latest?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch latest tokens");
      }
      return response.json();
    },
  });

  // Keyboard shortcut: Ctrl+K to open modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 animate-fadeSlideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Santara Logo"
                width={32}
                height={32}
                className="object-contain h-8 w-auto"
                priority
              />
              <span className="text-lg tracking-tight font-geist font-normal">Santara Security</span>
            </Link>
          </div>

          {/* Center: Search Button */}
          <div className="flex-1 flex justify-center">
            <button
              className="hidden md:flex items-center justify-between w-full max-w-xs bg-neutral-700/40 rounded p-2 border border-neutral-600/30 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/20 transition-colors cursor-pointer"
              title="Open Search (Ctrl+K)"
              onClick={() => {
                refetch();
                setShowModal(true);
              }}
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="text-xs font-mono">Search Contract</span>
              </span>
              <span className="flex items-center px-2 py-0.5 bg-neutral-700/50 text-neutral-400 rounded text-[10px] font-mono border border-neutral-600/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3 mr-1"
                >
                  <rect x="3" y="7" width="18" height="10" rx="2" />
                  <path d="M8 11h8" />
                </svg>
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right: Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/analyze-sc"
              className="text-xs font-mono text-neutral-400 hover:text-neutral-200 transition-colors font-geist font-normal 
              bg-[#111] border border-[#353535] hover:bg-[#222] rounded flex justify-center items-center w-full px-4 py-2"
            >
              <ShinyText text="Analyze Contract with AI ✨" speed={10} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu w-5 h-5"
            >
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
              <path d="M4 6h16"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Modal */}
      <SearchModal
        open={showModal}
        onClose={() => setShowModal(false)}
        data={latestTokens}
        loading={loadingLatestTokens}
      />
    </nav>
  );
}
