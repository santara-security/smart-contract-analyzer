"use client";
import React, { act, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ImpactBadge = ({ impact }) => {
  const getBadgeStyles = (impact) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-600/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-orange-600/20 text-orange-400 border-orange-500/50";
      case "low":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/50";
      case "informational":
        return "bg-blue-600/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/50";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${getBadgeStyles(
        impact
      )}`}
    >
      {impact}
    </span>
  );
};

const ConfidenceBadge = ({ confidence }) => {
  const getBadgeStyles = (confidence) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "bg-green-600/20 text-green-400 border-green-500/50";
      case "medium":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-red-600/20 text-red-400 border-red-500/50";
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/50";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full border ${getBadgeStyles(
        confidence
      )}`}
    >
      Confidence: {confidence}
    </span>
  );
};

const DetectorCard = ({ detector, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-neutral-400 text-sm">#{index + 1}</span>
          <ImpactBadge impact={detector.impact} />
          <ConfidenceBadge confidence={detector.confidence} />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      <div className="mb-3">
        <h4 className="text-neutral-200 font-medium mb-2">
          <span className="text-blue-400 font-mono text-sm">
            {detector.check}
          </span>
        </h4>
        <div className="text-neutral-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-400 hover:text-blue-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="bg-neutral-700/50 px-1 py-0.5 rounded text-xs font-mono text-neutral-200">
                  {children}
                </code>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 mb-2">{children}</ul>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {detector.markdown || detector.description}
          </ReactMarkdown>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-700 pt-3 mt-3">
          <h5 className="text-neutral-200 font-medium mb-2">
            Affected Elements:
          </h5>
          <div className="space-y-2">
            {detector.elements?.map((element, elementIndex) => (
              <div key={elementIndex} className="bg-neutral-700/30 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 text-sm font-medium">
                    {element.type}:
                  </span>
                  <span className="text-neutral-200 font-mono text-sm">
                    {element.name}
                  </span>
                </div>
                {element.source_mapping && (
                  <div className="text-xs text-neutral-400 space-y-1">
                    <div>
                      <span className="font-medium">File:</span>{" "}
                      {element.source_mapping.filename_short}
                    </div>
                    {element.source_mapping.lines && (
                      <div>
                        <span className="font-medium">Lines:</span>{" "}
                        {element.source_mapping.lines.slice(0, 5).join(", ")}
                        {element.source_mapping.lines.length > 5 && "..."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AnalysisSummary = ({ detectors }) => {
  const summary = detectors.reduce((acc, detector) => {
    const impact = detector.impact.toLowerCase();
    acc[impact] = (acc[impact] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">
        Security Analysis Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(summary).map(([impact, count]) => (
          <div key={impact} className="text-center">
            <div className="text-2xl font-bold text-neutral-200">{count}</div>
            <div className="flex justify-center">
              <ImpactBadge impact={impact} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-neutral-400 pb-3">
        Total findings:{" "}
        <span className="font-medium text-neutral-200">{detectors.length}</span>
      </div>
      <div className="text-xs text-neutral-500 border-t border-neutral-700 pt-3">
        <p>
          This contract has been analyzed for security vulnerabilities using
          Slither static analysis. The analysis covers common security issues
          and coding best practices.
        </p>
      </div>
    </div>
  );
};

export const AnalysisResults = ({ analysisData, activeTab }) => {
  if(activeTab !== "audit") {
    return null;
  };
  const [filterImpact, setFilterImpact] = useState("all");
  const [sortBy, setSortBy] = useState("impact");

  if (!analysisData?.result?.results?.detectors) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Analysis Results
        </h3>
        <div className="text-center py-8">
          <p className="text-neutral-400">No analysis data available</p>
        </div>
      </div>
    );
  }

  const detectors = analysisData.result.results.detectors;

  // Filter detectors by impact
  const filteredDetectors = detectors.filter(
    (detector) =>
      filterImpact === "all" || detector.impact.toLowerCase() === filterImpact
  );

  // Sort detectors
  const sortedDetectors = [...filteredDetectors].sort((a, b) => {
    if (sortBy === "impact") {
      const impactOrder = { high: 4, medium: 3, low: 2, informational: 1 };
      return (
        (impactOrder[b.impact.toLowerCase()] || 0) -
        (impactOrder[a.impact.toLowerCase()] || 0)
      );
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <AnalysisSummary detectors={detectors} />

      <div className="bg-neutral-800/30 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-neutral-200">
            Security Findings ({filteredDetectors.length})
          </h3>

          <div className="flex gap-3">
            <select
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
              className="bg-neutral-700 border border-neutral-600 rounded px-3 py-1 text-sm text-neutral-200"
            >
              <option value="all">All Impact Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="informational">Informational</option>
            </select>

            {/* <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-700 border border-neutral-600 rounded px-3 py-1 text-sm text-neutral-200"
            >
              <option value="impact">Sort by Impact</option>
            </select> */}
          </div>
        </div>

        {sortedDetectors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-400">
              No findings match the current filter
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDetectors.map((detector, index) => (
              <DetectorCard
                key={detector.id || index}
                detector={detector}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-700">
          <div className="text-xs text-neutral-400 space-y-1">
            <p>
              <span className="font-medium">Analysis File:</span>{" "}
              <span className="font-mono">{analysisData.filePath}</span>
            </p>
            <p>
              <span className="font-medium">Contract:</span>{" "}
              {analysisData.tokenAddress} ({analysisData.chain})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
