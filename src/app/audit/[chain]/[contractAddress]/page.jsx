"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import {
  ContractInfoGrid,
  AnalysisResults,
  ErrorDisplay,
  Honeypot,
  Bubblemap,
} from "./_components";
import { useAuditAnalysis, useIsHoneyPot, useTokenInfo } from "./_hooks";
import { TabButton } from "./_components/TabButton";
import Chart from "./_components/Chart";

// Custom hook to update document title
function useDocumentTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
}

export default function AuditPage({ params }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState(null);
  const [activeTab, setActiveTab] = useState("chart"); //chart, token, audit, honeypot

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  // Use audit analysis hook only when params are resolved
  const {
    analysisData,
    loading: auditLoading,
    error: auditError,
    retry: retryAudit,
  } = useAuditAnalysis(resolvedParams?.chain, resolvedParams?.contractAddress);

  const {
    tokenData: tokenInfoData,
    loading: tokenInfoLoading,
    error: tokenInfoError,
    retry: retryTokenInfo,
  } = useTokenInfo(resolvedParams?.chain, resolvedParams?.contractAddress);

  const {
    honeypotPairs,
    honeypotTopHolders,
    honeyPot,
    loadingHoneypot,
    errorHoneypot,
    retryHoneypot,
    checkHoneypotWithPair,
  } = useIsHoneyPot(resolvedParams?.chain, resolvedParams?.contractAddress);

  // Update document title when token data is available
  useDocumentTitle(
    tokenInfoData?.symbol
      ? `${tokenInfoData?.symbol} - Smart Contract Analysis`
      : "Smart Contract Analysis"
  );

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
              loading={auditLoading}
              error={auditError}
              analysisData={analysisData}
            />

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <TabButton
                active={activeTab === "chart"}
                onClick={() => setActiveTab("chart")}
              >
                Chart
              </TabButton>

              <TabButton
                active={activeTab === "honeypot"}
                onClick={() => setActiveTab("honeypot")}
              >
                Honeypot Check
              </TabButton>

              <TabButton
                active={activeTab === "bubblemap"}
                onClick={() => setActiveTab("bubblemap")}
              >
                Bubblemap
              </TabButton>

              <TabButton
                active={activeTab === "audit"}
                onClick={() => setActiveTab("audit")}
              >
                Smart Contract Audit
              </TabButton>
            </div>

            {/* Tab Content */}

            {activeTab === "honeypot" && (
              <Honeypot
                honeypotPairs={honeypotPairs}
                honeypotTopHolders={honeypotTopHolders}
                honeyPot={honeyPot}
                loadingHoneypot={loadingHoneypot}
                errorHoneypot={errorHoneypot}
                retryHoneypot={retryHoneypot}
                checkHoneypotWithPair={checkHoneypotWithPair}
                activeTab={activeTab}
              />
            )}

            {activeTab === "bubblemap" && (
              <Bubblemap
                contractAddress={resolvedParams.contractAddress}
                chain={resolvedParams.chain}
                activeTab={activeTab}
              />
            )}

            {activeTab === "audit" && (
              <>
                <AnalysisResults
                  analysisData={analysisData}
                  activeTab={activeTab}
                />
                <ErrorDisplay error={auditError} onRetry={retryAudit} />
              </>
            )}

            <Chart contractAddress={resolvedParams.contractAddress} />
          </div>
        </Card>
      </section>
    </div>
  );
}
