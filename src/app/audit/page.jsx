"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/InputField";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SelectField } from "@/components/SelectField";
import { chains } from "@/lib/chains";
import LatestCard from "./_components/LatestCard";
import TrendingCard from "./_components/TrendingCard";
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
    <div className="bg-transparent z-10 flex flex-col px-8 py-12 gap-8 mt-16 max-w-7xl mx-auto">
      {/* Hero Section with Form */}
      <section className="w-full">
        <Card title="Smart Contract Analyzer">
          <div className="mb-6">
            <p className="text-neutral-300 mb-4">
              Analyze smart contracts for security vulnerabilities, honeypot
              detection, and detailed auditing.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Analyze Token
                </span>
              </Button>
            </div>
          </form>
        </Card>
      </section>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Security Audits Card */}
        <section className="w-full">
          <LatestCard
            handleTokenClick={handleTokenClick}
            data={latestTokens}
            loading={loadingLatestTokens}
          />
        </section>

        {/* Market Trending Tokens Card */}
        <section className="w-full">
          <TrendingCard handleTokenClick={handleTokenClick} />
        </section>
      </div>

      {/* Analytics Dashboard Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Analyzed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  1,247
                </div>
                <div className="text-sm text-neutral-300 font-medium">
                  Smart contracts analyzed
                </div>
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                  +23 today
                </div>
              </div>
            </div>
          </Card>

          <Card title="Vulnerabilities">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400 mb-1">89</div>
                <div className="text-sm text-neutral-300 font-medium">
                  Critical issues detected
                </div>
                <div className="text-xs text-orange-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  2 this week
                </div>
              </div>
            </div>
          </Card>

          <Card title="Verified Safe">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  1,158
                </div>
                <div className="text-sm text-neutral-300 font-medium">
                  Contracts verified safe
                </div>
                <div className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  92.8% success
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default InputToken;
