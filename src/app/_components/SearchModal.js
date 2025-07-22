import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

export default function SearchModal({ open, onClose, data, loading }) {
  const [input, setInput] = useState("");
  const router = useRouter();
  if (!open) return null;
  const isValidAddress = input.length === 42;
  const isInvalidAddress = input.length > 0 && input.length < 42;

  // Handler for click on input or icon when valid
  const handleAudit = () => {
    if (isValidAddress) {
      router.push(`/audit/base/${input}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen bg-black/80 backdrop-blur-lg"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-black backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50 rounded transition-colors"
          title="Close"
          onClick={onClose}
          aria-label="Close search modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {/* Modal Content: Search Input */}
        <h2 className="text-sm font-semibold text-neutral-200 mb-4 text-center">
          Search Contract
        </h2>
        <form
          className="flex items-center w-full bg-neutral-700/40 rounded p-2 border border-neutral-600/30"
          onSubmit={(e) => {
            e.preventDefault();
            if (isValidAddress) handleAudit();
          }}
        >
          <input
            type="text"
            placeholder="Type to search..."
            className={`flex-1 bg-transparent outline-none text-xs text-neutral-200 font-mono placeholder:text-neutral-500 ${
              isValidAddress ? "cursor-pointer" : ""
            }`}
            aria-label="Search"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={isValidAddress ? handleAudit : undefined}
          />
          <button
            type="submit"
            className={`ml-1.5 p-1 rounded transition-all duration-200 ${
              isValidAddress
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/20"
            }`}
            title={isValidAddress ? "Go to Audit" : "Search"}
            tabIndex={isValidAddress ? 0 : -1}
          >
            {isValidAddress ? (
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
                className="w-4 h-4"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            ) : (
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
                className="w-4 h-4"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </form>
        {isInvalidAddress && (
          <span className="block mt-2 text-xs text-red-400 text-center">
            Invalid address
          </span>
        )}

        {/* Recent Security Audits Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-neutral-200 mb-3">
            Recent Security Audits
          </h3>
          <div className="space-y-2">
            {loading
              ? // Loading skeleton per design reference
                [...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg border border-neutral-700/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-neutral-700/50 rounded animate-pulse mb-1 w-32"></div>
                      <div className="h-3 bg-neutral-700/50 rounded animate-pulse w-80"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="h-5 w-14 bg-neutral-700/50 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-neutral-700/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              : (data || []).map((token) => (
                  <Link
                    key={token.id}
                    href={`/audit/${token.chain}/${token.address}`}
                    className="group flex items-center justify-between p-3 bg-neutral-800/30 hover:bg-neutral-800/50 rounded-lg cursor-pointer transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600/50"
                    prefetch={false}
                    onClick={onClose}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-neutral-200 mb-1">
                        {token.name}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono truncate">
                        {token.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <svg
                        className="w-3 h-3 text-neutral-500 group-hover:text-neutral-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-red-500 to-transparent"
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          borderWidth={2}
          className="from-transparent via-blue-500 to-transparent"
        />
      </div>
    </div>
  );
}
