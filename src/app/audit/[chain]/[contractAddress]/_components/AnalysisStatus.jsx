"use client";
import React from "react";
import { RiskBadge } from "@/components/Badge";
import {
  Loader2,
  X,
  Check,
  Shield,
  AlertTriangle,
  Zap,
  TrendingUp,
  Users,
  Copy,
} from "lucide-react";
import { formatTax } from "@/lib/utils/helpers";

const ProgressBar = ({ status, progress = 0, children }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "auditLoading":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case "auditLoading":
        return "text-blue-400";
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="space-y-2">
      <div className={`flex items-center space-x-2 ${getTextColor(status)}`}>
        {children}
      </div>
      <div className="w-full bg-neutral-700/50 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getStatusColor(
            status
          )} ${status === "auditLoading" ? "animate-pulse" : ""}`}
          style={{
            width: `${
              status === "auditLoading"
                ? progress
                : status === "success"
                ? 100
                : status === "error"
                ? 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  );
};

const exampleHoneypotData = {
  token: {
    name: "Virtual Protocol",
    symbol: "VIRTUAL",
    decimals: 18,
    address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    totalHolders: 886547,
    airdropSummary: {
      totalTxs: 11632,
      totalAmountWei: "66749331153738012176191058",
      totalTransfers: 1150270,
    },
  },
  withToken: {
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0x4200000000000000000000000000000000000006",
    totalHolders: 3508061,
  },
  summary: {
    risk: "low",
    riskLevel: 1,
    flags: [],
  },
  simulationSuccess: true,
  honeypotResult: {
    isHoneypot: false,
  },
  simulationResult: {
    buyTax: 0,
    sellTax: 0,
    transferTax: 0,
    buyGas: "142582",
    sellGas: "102222",
  },
  holderAnalysis: {
    holders: "2906",
    successful: "2906",
    failed: "0",
    siphoned: "0",
    averageTax: 0,
    averageGas: 101854.76256022023,
    highestTax: 0,
    highTaxWallets: "0",
    taxDistribution: [
      {
        tax: 0,
        count: 2906,
      },
    ],
    snipersFailed: 0,
    snipersSuccess: 0,
  },
  flags: [],
  contractCode: {
    openSource: true,
    rootOpenSource: true,
    isProxy: false,
    hasProxyCalls: false,
  },
  chain: {
    id: "8453",
    name: "Base",
    shortName: "base",
    currency: "ETH",
  },
  router: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
  pair: {
    pair: {
      name: "Uniswap V2: VIRTUAL-WETH",
      address: "0xE31c372a7Af875b3B5E0F3713B17ef51556da667",
      token0: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
      token1: "0x4200000000000000000000000000000000000006",
      type: "UniswapV2",
    },
    chainId: "8453",
    reserves0: "2059734990319439483539665",
    reserves1: "1006375130611006550964",
    liquidity: 7146469.739533976,
    router: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
    createdAtTimestamp: "1729527427",
    creationTxHash:
      "0x054bebd19c6928dc2f097a110f877b625bf7262088506539147c1a49c165a80e",
  },
  pairAddress: "0xe31c372a7af875b3b5e0f3713b17ef51556da667",
};

const HoneyPotCard = ({ honeyPot }) => {
  const [copiedAddress, setCopiedAddress] = React.useState("");

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(""), 2000);
  };

  if (!honeyPot) return null;

  const {
    token,
    withToken,
    summary,
    simulationSuccess,
    honeypotResult,
    simulationResult,
    holderAnalysis,
    contractCode,
    chain,
    pair,
  } = honeyPot;

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatGas = (gas) => {
    return parseInt(gas).toLocaleString();
  };

  console.log(`contract code vvvv`);
  console.log(contractCode);

  return (
    <div className="mt-4 space-y-4">
      {/* Main Status Header */}
      <div className="p-4 bg-neutral-700/30 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-neutral-200 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Honeypot Analysis</span>
          </h4>
          <RiskBadge status={summary?.risk} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {contractCode.hasOwnProperty("openSource") && (
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  contractCode.openSource ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-neutral-300">
                {contractCode.openSource ? "Open Source" : "Closed Source"}
              </span>
            </div>
          )}

          {contractCode.hasOwnProperty("isProxy") && (
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  contractCode.isProxy ? "bg-orange-500" : "bg-green-500"
                }`}
              />
              <span className="text-neutral-300">
                {contractCode.isProxy ? "Proxy Contract" : "Direct Contract"}
              </span>
            </div>
          )}
        </div>

        {contractCode.hasOwnProperty("hasProxyCalls") && (
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div>
              <span className="text-xs text-neutral-400 block mb-1">
                Buy Tax
              </span>
              <p className="text-xs text-neutral-200 font-medium">
                {formatTax(simulationResult.buyTax)}%
              </p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 block mb-1">
                Sell Tax
              </span>
              <p className="text-xs text-neutral-200 font-medium">
                {formatTax(simulationResult.sellTax)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AnalysisStatus = ({
  auditLoading,
  error,
  analysisData,
  analysisScore,
  honeyPot,
  honeyPotLoading,
  honeyPotError,
}) => {
  const stats = !analysisData?.result?.results?.detectors ? null : true;
  const [progress, setProgress] = React.useState(0);
  const [honeypotProgress, setHoneypotProgress] = React.useState(0);

  // Simulate progress for loading state
  React.useEffect(() => {
    if (auditLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Don't complete until actually done
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [auditLoading]);

  React.useEffect(() => {
    if (honeyPotLoading) {
      const interval = setInterval(() => {
        setHoneypotProgress((prev) => {
          if (prev >= 90) return 90; // Don't complete until actually done
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setHoneypotProgress(0);
    }
  }, [honeyPotLoading]);

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">
        Analysis Status
      </h3>

      <div className="space-y-4">
        {auditLoading && (
          <ProgressBar status="auditLoading" progress={progress}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Analyzing contract security...</span>
          </ProgressBar>
        )}

        {!auditLoading && error && (
          <ProgressBar status="error">
            <X className="h-4 w-4" />
            <span className="text-sm">Error analyzing contract</span>
          </ProgressBar>
        )}

        {!auditLoading && !error && analysisData && (
          <ProgressBar status="success">
            <Check className="h-4 w-4" />
            <span className="text-sm">Contract Analysis Complete</span>
          </ProgressBar>
        )}

        {honeyPotLoading && (
          <ProgressBar status="auditLoading" progress={honeypotProgress}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Checking Honeypot status...</span>
          </ProgressBar>
        )}

        {!honeyPotLoading && honeyPot && honeyPot.length > 0 && (
          <ProgressBar status="success">
            <Check className="h-4 w-4" />
            <span className="text-sm">Honeypot Check Complete</span>
          </ProgressBar>
        )}

        {!honeyPotLoading && honeyPot && honeyPot.length === 0 && (
          <ProgressBar status="error">
            <X className="h-4 w-4" />
            <span className="text-sm">No Honeypot detected</span>
          </ProgressBar>
        )}

        {!honeyPotLoading ||
          (honeyPotError && (
            <ProgressBar status="error">
              <X className="h-4 w-4" />
              <span className="text-sm">Honeypot Check Failed</span>
            </ProgressBar>
          ))}

        {honeyPotError && (
          <ProgressBar status="error">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Error checking Honeypot status</span>
          </ProgressBar>
        )}

        {!auditLoading &&
          !error &&
          !honeyPotError &&
          stats &&
          analysisData &&
          analysisScore !== undefined && (
            <div className="mt-4 p-3 bg-neutral-700/30 rounded-lg">
              <h4 className="text-sm font-medium text-neutral-200 mb-3">
                Security Score:
              </h4>
              <div className="space-y-3">
                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-200">
                    {analysisScore}/100
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      analysisScore >= 80
                        ? "text-green-400"
                        : analysisScore >= 60
                        ? "text-yellow-400"
                        : analysisScore >= 40
                        ? "text-orange-400"
                        : "text-red-400"
                    }`}
                  >
                    {analysisScore >= 80
                      ? "Excellent"
                      : analysisScore >= 60
                      ? "Good"
                      : analysisScore >= 40
                      ? "Fair"
                      : "Poor"}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-neutral-600/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      analysisScore >= 80
                        ? "bg-green-500"
                        : analysisScore >= 60
                        ? "bg-yellow-500"
                        : analysisScore >= 40
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${analysisScore}%` }}
                  />
                </div>

                {/* Score Description */}
                <p className="text-xs text-neutral-400">
                  {analysisScore >= 80
                    ? "This contract shows strong security practices with minimal risks."
                    : analysisScore >= 60
                    ? "This contract has good security but may have some minor issues."
                    : analysisScore >= 40
                    ? "This contract has moderate security concerns that should be reviewed."
                    : "This contract has significant security issues that require immediate attention."}
                </p>
              </div>
            </div>
          )}

        {!honeyPotLoading &&
          honeyPot &&
          !honeyPotError &&
          honeyPot.length > 0 && <HoneyPotCard honeyPot={honeyPot[0]} />}
      </div>
    </div>
  );
};
