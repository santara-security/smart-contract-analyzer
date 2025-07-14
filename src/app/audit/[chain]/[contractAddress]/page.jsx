"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { ContractInfoGrid, AnalysisResults, ErrorDisplay } from "./_components";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
    }`}
  >
    {children}
  </button>
);

const TokenInfo = () => (
  <div className="bg-neutral-800/30 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-neutral-200 mb-4">
      Token Information
    </h3>
    <div className="text-center py-12">
      <div className="text-neutral-400 mb-2">
        <svg
          className="w-12 h-12 mx-auto mb-4 opacity-50"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-neutral-400 text-sm">
        Token information will be displayed here
      </p>
      <p className="text-neutral-500 text-xs mt-2">
        Coming soon: Token name, symbol, supply, holders, and more
      </p>
    </div>
  </div>
);

export default function AuditPage({ params }) {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);
  const [activeTab, setActiveTab] = useState("token"); // 'audit' or 'token'

  // Resolve params in useEffect
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams?.chain && resolvedParams?.contractAddress) {
      analyzeToken();
    }
  }, [resolvedParams]);

  const analyzeToken = async () => {
    if (!resolvedParams?.chain || !resolvedParams?.contractAddress) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/audit?tokenAddress=${resolvedParams.contractAddress}&chain=${resolvedParams.chain}`
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze token");
      }

      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    router.push("/audit");
  };

  // Show loading while params are being resolved
  if (!resolvedParams) {
    return (
      <div className="bg-transparent z-10 flex flex-col px-8 py-12 gap-8 mt-16 max-w-7xl mx-auto">
        <section className="w-full">
          <Card title="Loading...">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-transparent z-10 flex flex-col px-8 py-12 gap-8 mt-16 max-w-7xl mx-auto">
      <section className="w-full">
        <Card title="Smart Contract Analysis">
          <div className="space-y-6">
            {/* Contract Information Grid */}
            <ContractInfoGrid
              chain={resolvedParams.chain}
              contractAddress={resolvedParams.contractAddress}
              loading={loading}
              error={error}
              analysisData={analysisData}
            />

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <TabButton
                active={activeTab === "token"}
                onClick={() => setActiveTab("token")}
              >
                Token Info
              </TabButton>
              <TabButton
                active={activeTab === "audit"}
                onClick={() => setActiveTab("audit")}
              >
                Smart Contract Audit
              </TabButton>
            </div>

            {/* Tab Content */}
            {activeTab === "audit" && (
              <>
                <AnalysisResults analysisData={analysisData} />
                <ErrorDisplay error={error} onRetry={analyzeToken} />
              </>
            )}

            {activeTab === "token" && <TokenInfo />}
          </div>
        </Card>
      </section>
    </div>
  );
}
