"use client";
import React from "react";

const StatusIndicator = ({ status, children }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'loading':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'success':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
    }
  };

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getStatusStyles(status)}`}>
      {children}
    </div>
  );
};

export const AnalysisStatus = ({ loading, error, analysisData }) => {
  const getAnalysisStats = () => {
    if (!analysisData?.result?.results?.detectors) return null;
    
    const detectors = analysisData.result.results.detectors;
    const stats = detectors.reduce((acc, detector) => {
      const impact = detector.impact.toLowerCase();
      acc[impact] = (acc[impact] || 0) + 1;
      return acc;
    }, {});

    return stats;
  };

  const stats = getAnalysisStats();

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">
        Analysis Status
      </h3>
      
      <div className="space-y-3">
        {loading ? (
          <StatusIndicator status="loading">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Analyzing contract security...</span>
          </StatusIndicator>
        ) : error ? (
          <StatusIndicator status="error">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Analysis failed</span>
          </StatusIndicator>
        ) : analysisData ? (
          <StatusIndicator status="success">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Analysis complete</span>
          </StatusIndicator>
        ) : (
          <StatusIndicator status="default">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Ready to analyze</span>
          </StatusIndicator>
        )}

        {stats && (
          <div className="mt-4 p-3 bg-neutral-700/30 rounded-lg">
            <h4 className="text-sm font-medium text-neutral-200 mb-2">Quick Summary:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(stats).map(([impact, count]) => (
                <div key={impact} className="flex justify-between">
                  <span className="capitalize text-neutral-400">{impact}:</span>
                  <span className="font-medium text-neutral-200">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-600 text-xs text-neutral-400">
              Total findings: <span className="font-medium text-neutral-200">
                {Object.values(stats).reduce((sum, count) => sum + count, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
