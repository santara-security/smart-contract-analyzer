"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";
import { Card } from "@/components/Card";
import { SelectField } from "@/components/SelectField";
import { chains } from "@/lib/chains";
import LatestCard from "./_components/LatestCard";
// import TrendingCard from "./_components/TrendingCard";
import { useQuery } from "@tanstack/react-query";

export const InputToken = function InputToken() {
  const router = useRouter();

  const { data: latestTokens, isLoading: loadingLatestTokens } = useQuery({
    queryKey: ["latestTokens"],
    queryFn: async () => {
      const response = await fetch("/api/tokens/latest");
      if (!response.ok) {
        throw new Error("Failed to fetch latest tokens");
      }
      return response.json();
    },
  });

  const handleTokenClick = (token) => {
    router.push(`/audit/${token.chain}/${token.address}`);
  };

  const chainOptions = chains.map((chain) => ({
    value: chain.name,
    label:
      chain.displayName ||
      chain.name.charAt(0).toUpperCase() + chain.name.slice(1),
    logo: chain.iconUrl,
  }));

  // Add state management for form inputs here later
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [chain, setChain] = React.useState(chainOptions[0]?.value || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!tokenAddress.trim()) {
      alert("Please enter a token address");
      return;
    }

    if (!chain) {
      alert("Please select a chain");
      return;
    }

    // Handle form submission logic here
    console.log("Analyzing:", { tokenAddress, chain });

    // Redirect to the dynamic route
    router.push(`/audit/${chain}/${tokenAddress}`);
  };

  return (
    <div className="bg-transparent z-10 flex flex-col px-6 py-8 gap-6 mt-12 max-w-7xl mx-auto">
      {/* Hero Section with Form */}
      <section className="w-full">
        <div className="bg-neutral-900/20 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-neutral-200 mb-4">Smart Contract Analyzer</h2>
          
          <p className="text-neutral-300 text-sm mb-4">
            Analyze smart contracts for security vulnerabilities, honeypot detection, and detailed auditing.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="Token Address"
                id="tokenAddress"
                type="text"
                placeholder="Enter token address (e.g., 0x...)"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />

              <SelectField
                label="Chain"
                id="chain"
                options={chainOptions}
                value={chain}
                onChange={(value) => setChain(value)}
              />
            </div>

            <div className="flex items-center justify-start">
              <button
                type="submit"
                className="group relative px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-slate-500/25 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-neutral-900 border border-slate-600/30 hover:border-slate-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 text-slate-300 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-slate-200 group-hover:text-white transition-colors duration-300">
                    Analyze Token
                  </span>
                </span>
                
                {/* Sophisticated shine effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12"></div>
                
                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-400/0 via-slate-300/5 to-slate-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Recent Security Audits Section */}
      <section className="w-full">
        <LatestCard
          handleTokenClick={handleTokenClick}
          data={latestTokens}
          loading={loadingLatestTokens}
        />
      </section>
    </div>
  );
};

export default InputToken;
