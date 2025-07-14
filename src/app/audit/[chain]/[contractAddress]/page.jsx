"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { 
  ContractInfoGrid,
  AnalysisResults,
  ErrorDisplay,
  ActionButtons
} from "./_components";

export default function AuditPage({ params }) {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolvedParams, setResolvedParams] = useState(null);

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
        <Card title="Smart Contract Analysis Results">
          <div className="space-y-6">
            {/* Contract Information Grid */}
            <ContractInfoGrid 
              chain={resolvedParams.chain}
              contractAddress={resolvedParams.contractAddress}
              loading={loading}
              error={error}
              analysisData={analysisData}
            />

            {/* Analysis Results */}
            <AnalysisResults analysisData={analysisData} />

            {/* Error Display */}
            <ErrorDisplay error={error} onRetry={analyzeToken} />

            {/* Action Buttons */}
            <ActionButtons 
              loading={loading}
              onReanalyze={analyzeToken}
              onNewAnalysis={handleNewAnalysis}
            />
          </div>
        </Card>
      </section>
    </div>
  );
}
