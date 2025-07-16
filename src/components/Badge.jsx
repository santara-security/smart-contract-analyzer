"use client";
import clsx from "clsx";

export const RiskBadge = ({ status }) => {
  const getBadgeStyles = (status) => {
    switch (status.toLowerCase()) {
      case "very_high":
        return "bg-red-700/20 text-red-500 border-red-700/50";
      case "high":
        return "bg-red-600/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-orange-600/20 text-orange-400 border-orange-500/50";
      case "low":
        return "bg-green-900/20 text-green-400 border-green-500/50";
      case "very_low":
        return "bg-green-600/20 text-green-400 border-green-500/50";
      case "honeypot":
        return "bg-pink-600/20 text-pink-400 border-pink-500/50";
      case "unknown":
      default:
        return "bg-neutral-600/20 text-neutral-400 border-neutral-500/50";
    }
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs rounded-full border",
        getBadgeStyles(status)
      )}
    >
      Risk: {status}
    </span>
  );
};

export const ImpactBadge = ({ impact }) => {
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
      className={clsx(
        "px-2 py-1 text-xs rounded-full border",
        getBadgeStyles(impact)
      )}
    >
      {impact}
    </span>
  );
};

export const ConfidenceBadge = ({ confidence }) => {
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
      className={clsx(
        "px-2 py-1 text-xs rounded-full border",
        getBadgeStyles(confidence)
      )}
    >
      Confidence: {confidence}
    </span>
  );
};
