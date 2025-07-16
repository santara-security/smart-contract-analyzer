"use client";
import React from "react";
import { RiskBadge } from "@/components/Badge";
import { Loader2, X, Check } from "lucide-react";

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

export const AnalysisStatus = ({
  auditLoading,
  error,
  analysisData,
  analysisSummary,
  analysisScore
}) => {
  const stats = !analysisData?.result?.results?.detectors ? null : true;
  const [progress, setProgress] = React.useState(0);

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

        {!auditLoading && !error && stats && analysisData && analysisScore !== undefined && (
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
                <span className={`text-sm font-medium ${
                  analysisScore >= 80 ? 'text-green-400' :
                  analysisScore >= 60 ? 'text-yellow-400' :
                  analysisScore >= 40 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {analysisScore >= 80 ? 'Excellent' :
                   analysisScore >= 60 ? 'Good' :
                   analysisScore >= 40 ? 'Fair' : 'Poor'}
                </span>
              </div>
              
              {/* Score Progress Bar */}
              <div className="w-full bg-neutral-600/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    analysisScore >= 80 ? 'bg-green-500' :
                    analysisScore >= 60 ? 'bg-yellow-500' :
                    analysisScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisScore}%` }}
                />
              </div>
              
              {/* Score Description */}
              <p className="text-xs text-neutral-400">
                {analysisScore >= 80 ? 'This contract shows strong security practices with minimal risks.' :
                 analysisScore >= 60 ? 'This contract has good security but may have some minor issues.' :
                 analysisScore >= 40 ? 'This contract has moderate security concerns that should be reviewed.' :
                 'This contract has significant security issues that require immediate attention.'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-neutral-700/30 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-200 mb-2">
            Honeypot Check Status
            <RiskBadge status={"very_low"} />
            <RiskBadge status={"low"} />
            <RiskBadge status={"honeypot"} />
            <RiskBadge status={"honeypot"} />
            <RiskBadge status={"unknown"} />
            <RiskBadge status={"very_high"} />
            <RiskBadge status={"high"} />
          </h4>
        </div>
      </div>
    </div>
  );
};
