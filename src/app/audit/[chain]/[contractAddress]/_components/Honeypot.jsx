"use client";

import React, { useState } from "react";
import { formatTax } from "@/lib/utils/helpers";

const RiskBadge = ({ risk, riskLevel }) => {
  const getBadgeStyles = (risk, riskLevel) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "bg-red-600/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-orange-600/20 text-orange-400 border-orange-500/50";
      case "low":
        return "bg-green-600/20 text-green-400 border-green-500/50";
      default:
        if (riskLevel >= 8)
          return "bg-red-600/20 text-red-400 border-red-500/50";
        if (riskLevel >= 5)
          return "bg-orange-600/20 text-orange-400 border-orange-500/50";
        if (riskLevel >= 1)
          return "bg-yellow-600/20 text-yellow-400 border-yellow-500/50";
        return "bg-green-600/20 text-green-400 border-green-500/50";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${getBadgeStyles(
        risk,
        riskLevel
      )}`}
    >
      Risk: {risk || `Risk Level ${riskLevel || 0}`}
    </span>
  );
};

const StatusBadge = ({ isHoneypot, simulationSuccess }) => {
  // Check if simulation failed (explicitly false or undefined/null)
  if (simulationSuccess === false) {
    return (
      <span className="px-2 py-1 text-xs rounded-full border bg-neutral-600/20 text-neutral-400 border-neutral-500/50">
        Simulation Failed
      </span>
    );
  }

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${
        isHoneypot
          ? "bg-red-600/20 text-red-400 border-red-500/50"
          : "bg-green-600/20 text-green-400 border-green-500/50"
      }`}
    >
      Status: {isHoneypot ? "Honeypot" : "Safe"}
    </span>
  );
};

const formatReserves = (reserves) => {
  if (!reserves || reserves.length !== 2) return "N/A";
  return reserves
    .map((reserve) => {
      const num = parseFloat(reserve);
      if (num >= 1e18) return (num / 1e18).toFixed(2) + "E";
      if (num >= 1e15) return (num / 1e15).toFixed(2) + "P";
      if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
      if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
      if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
      return num.toFixed(2);
    })
    .join(" / ");
};

const formatLiquidity = (liquidity) => {
  if (liquidity >= 1e6) return `$${(liquidity / 1e6).toFixed(2)}M`;
  if (liquidity >= 1e3) return `$${(liquidity / 1e3).toFixed(2)}K`;
  return `$${liquidity?.toFixed(2) || 0}`;
};

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};


const PairCard = (props) => {
  const { pair, index, onAnalyze, honeypotResult, isLoading, isFirstItem } =
    props;

  const [isExpanded, setIsExpanded] = useState(isFirstItem || false);

  return (
    <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 text-sm">#{index + 1}</span>
          <span className="text-blue-400 font-mono text-sm">
            {pair.Pair?.Name || "Unknown Pair"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {honeypotResult && (
            <>
              {/* <RiskBadge
                risk={honeypotResult.summary?.risk}
                riskLevel={honeypotResult.summary?.riskLevel}
              /> */}
              <StatusBadge
                isHoneypot={honeypotResult.honeypotResult?.isHoneypot}
                simulationSuccess={honeypotResult.simulationSuccess}
              />
            </>
          )}
          <button
            onClick={() => {
              if (!honeypotResult && !isLoading && !isFirstItem) {
                onAnalyze(pair.Pair?.Address);
              }
              setIsExpanded(!isExpanded);
            }}
            disabled={isLoading}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium disabled:opacity-50"
          >
            {isLoading
              ? "Analyzing..."
              : isExpanded
              ? "Hide Details"
              : "Show Details"}
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-neutral-400">Liquidity:</span>
            <span className="text-neutral-200 ml-2 font-medium">
              {formatLiquidity(pair.Liquidity)}
            </span>
          </div>
          <div>
            <span className="text-neutral-400">Reserves:</span>
            <span className="text-neutral-200 ml-2 font-mono text-xs">
              {formatReserves(pair.Reserves)}
            </span>
          </div>
          <div>
            <span className="text-neutral-400">Created:</span>
            <span className="text-neutral-200 ml-2">
              {formatDate(pair.CreatedAtTimestamp)}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-700 pt-3 mt-3">
          {!honeypotResult && !isLoading && !isFirstItem && (
            <div className="text-center py-4">
              <button
                onClick={() => onAnalyze(pair.Pair?.Address)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Analyze Honeypot Risk
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-neutral-400 text-sm">
                Analyzing pair for honeypot risks...
              </p>
            </div>
          )}

          {/* {honeypotResult && (
            <div className="space-y-4">
              <div>
                <h5 className="text-neutral-200 font-medium mb-2">
                  Trading Analysis:
                </h5>
                <div className="bg-neutral-700/30 rounded p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-400">Buy Tax:</span>
                      <span className="text-neutral-200 ml-2 font-medium">
                        {formatTax(honeypotResult.simulationResult?.buyTax)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Sell Tax:</span>
                      <span className="text-neutral-200 ml-2 font-medium">
                        {formatTax(honeypotResult.simulationResult?.sellTax)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Buy Gas:</span>
                      <span className="text-neutral-200 ml-2 font-mono text-xs">
                        {honeypotResult.simulationResult?.buyGas || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Sell Gas:</span>
                      <span className="text-neutral-200 ml-2 font-mono text-xs">
                        {honeypotResult.simulationResult?.sellGas || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {honeypotResult.holderAnalysis && (
                <div>
                  <h5 className="text-neutral-200 font-medium mb-2">
                    Holder Analysis:
                  </h5>
                  <div className="bg-neutral-700/30 rounded p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-400">Total Holders:</span>
                        <span className="text-neutral-200 ml-2 font-medium">
                          {honeypotResult.holderAnalysis.holders}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Successful:</span>
                        <span className="text-green-400 ml-2 font-medium">
                          {honeypotResult.holderAnalysis.successful}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Failed:</span>
                        <span className="text-red-400 ml-2 font-medium">
                          {honeypotResult.holderAnalysis.failed}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400">Avg Gas:</span>
                        <span className="text-neutral-200 ml-2 font-mono text-xs">
                          {Math.round(
                            honeypotResult.holderAnalysis.averageGas || 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {honeypotResult.flags && honeypotResult.flags.length > 0 && (
                <div>
                  <h5 className="text-neutral-200 font-medium mb-2">
                    Risk Flags:
                  </h5>
                  <div className="space-y-2">
                    {honeypotResult.flags.map((flag, flagIndex) => (
                      <div
                        key={flagIndex}
                        className="bg-orange-600/10 border border-orange-500/30 rounded p-2"
                      >
                        <span className="text-orange-400 text-sm">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-neutral-400 space-y-1 border-t border-neutral-700 pt-3">
                <div>
                  <span className="font-medium">Pair Address:</span>{" "}
                  <span className="font-mono">{pair.Pair?.Address}</span>
                </div>
                <div>
                  <span className="font-medium">Router:</span>{" "}
                  <span className="font-mono">{pair.Router}</span>
                </div>
                {pair.CreationTxHash && (
                  <div>
                    <span className="font-medium">Creation Tx:</span>{" "}
                    <span className="font-mono text-xs">
                      {pair.CreationTxHash}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

const HoneypotSummary = ({ honeyPot, totalPairs }) => {
  if (!honeyPot) return null;

  // Handle both array and object format
  const honeypotData = Array.isArray(honeyPot) ? honeyPot[0] : honeyPot;
  const summary = honeypotData.summary || {};
  const simulationResult = honeypotData.simulationResult || {};

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">
        Honeypot Analysis Summary
      </h3>

      {/* Main token info */}
      <div className="mb-4 pb-4 border-b border-neutral-700">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-neutral-200 font-medium">
            {honeypotData.token?.name} ({honeypotData.token?.symbol})
          </h4>
          {/* <RiskBadge risk={summary.risk} riskLevel={summary.riskLevel} /> */}
          <StatusBadge
            isHoneypot={honeypotData.honeypotResult?.isHoneypot}
            simulationSuccess={honeypotData.simulationSuccess}
          />
        </div>
        {/* <div className="text-sm text-neutral-400">
          <span className="font-medium">Contract:</span>{" "}
          <span className="font-mono">{honeypotData.token?.address}</span>
        </div> */}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-200">
            {formatTax(simulationResult.buyTax)}%
          </div>
          <div className="text-xs text-neutral-400">Buy Tax</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-200">
            {formatTax(simulationResult.sellTax)}%
          </div>
          <div className="text-xs text-neutral-400">Sell Tax</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-200">
            {honeypotData.token?.totalHolders?.toLocaleString() || "N/A"}
          </div>
          <div className="text-xs text-neutral-400">Total Holders</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-neutral-200">{totalPairs}</div>
          <div className="text-xs text-neutral-400">Trading Pairs</div>
        </div>
      </div>

      <div className="text-xs text-neutral-500 border-t border-neutral-700 pt-3">
        <p>
          This token has been analyzed for honeypot characteristics across
          multiple trading pairs. The analysis includes transaction simulation,
          holder behavior analysis, and smart contract inspection.
        </p>
      </div>
    </div>
  );
};

export const Honeypot = ({
  honeypotPairs,
  honeypotTopHolders,
  honeyPot,
  loadingHoneypot,
  errorHoneypot,
  retryHoneypot,
  checkHoneypotWithPair,
  activeTab,
}) => {
  if (activeTab !== "honeypot") {
    return null;
  }

  const [pairAnalysisResults, setPairAnalysisResults] = useState({});
  const [loadingPairs, setLoadingPairs] = useState({});

  // Pre-populate the first pair with existing honeyPot data
  const getHoneypotResultForPair = (pairAddress, index) => {
    if (index === 0 && honeyPot) {
      // First pair uses the existing honeyPot data
      // Make sure to check if honeyPot is an array (from example) or direct object
      const honeypotData = Array.isArray(honeyPot) ? honeyPot[0] : honeyPot;
      return honeypotData;
    }
    // Other pairs use dynamically fetched data
    return pairAnalysisResults[pairAddress];
  };

  const handleAnalyzePair = async (pairAddress) => {
    if (!pairAddress || loadingPairs[pairAddress]) return;

    setLoadingPairs((prev) => ({ ...prev, [pairAddress]: true }));

    try {
      const result = await checkHoneypotWithPair(pairAddress);
      setPairAnalysisResults((prev) => ({ ...prev, [pairAddress]: result }));
    } catch (error) {
      console.error("Error analyzing pair:", error);
    } finally {
      setLoadingPairs((prev) => ({ ...prev, [pairAddress]: false }));
    }
  };

  if (loadingHoneypot) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Honeypot Analysis
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-neutral-400">
            Analyzing token for honeypot characteristics...
          </p>
        </div>
      </div>
    );
  }

  if (errorHoneypot) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Honeypot Analysis
        </h3>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Failed to load honeypot analysis</p>
          <button
            onClick={retryHoneypot}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!honeypotPairs || honeypotPairs.length === 0) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Honeypot Analysis
        </h3>
        <div className="text-center py-8">
          <p className="text-neutral-400">
            No trading pairs found for analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HoneypotSummary honeyPot={honeyPot} totalPairs={honeypotPairs.length} />

      <div className="bg-neutral-800/30 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-neutral-200">
            Trading Pairs Analysis ({honeypotPairs.length})
          </h3>
        </div>

        <div className="space-y-4">
          {honeypotPairs.map((pair, index) => (
            <PairCard
              key={pair.Pair?.Address || index}
              pair={pair}
              index={index}
              onAnalyze={handleAnalyzePair}
              honeypotResult={getHoneypotResultForPair(
                pair.Pair?.Address,
                index
              )}
              isLoading={loadingPairs[pair.Pair?.Address]}
              isFirstItem={index === 0}
            />
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-700">
          <div className="text-xs text-neutral-400 space-y-1">
            <p>
              <span className="font-medium">Note:</span> Click "Show Details" on
              any pair to analyze it for honeypot characteristics. Analysis
              includes transaction simulation, tax calculation, and holder
              behavior patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Honeypot;
