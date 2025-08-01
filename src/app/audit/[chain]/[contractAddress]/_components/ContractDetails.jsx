"use client";
import React from "react";
import { useTokenInfo } from "../_hooks";
import chains from "@/lib/chains";
import { formatNumber, formatSupply } from "@/lib/formatting";
import { Copy, Check, ExternalLink, Globe } from "lucide-react";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-600/20 rounded transition-all duration-200"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-2.5 h-2.5 text-green-400" />
      ) : (
        <Copy className="w-2.5 h-2.5" />
      )}
    </button>
  );
};

const getChainData = (chainName = "base") => {
  return chains.find((c) => c.name === chainName);
};

const getExplorerUrl = (selectedChain, address) => {
  return `${selectedChain?.explorerUrl}/token/${address}`;
};

export const ContractDetails = ({ chain, contractAddress }) => {
  const { tokenData, loading: tokenLoading } = useTokenInfo(
    chain,
    contractAddress
  );

  const selectedChain = getChainData(chain);

  const explorerUrl = getExplorerUrl(selectedChain, contractAddress);
  const chainDisplayName = selectedChain?.name.toUpperCase() || "Unknown Chain";

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold text-neutral-200">
          Contract Details
        </h3>
      </div>

      <div className="space-y-3">
        {/* Network Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">Network</span>
          <span className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/30">
            {chainDisplayName}
          </span>
        </div>

        {/* Contract Address */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400">Contract Address</span>
          <div className="flex items-center bg-neutral-700/40 rounded p-2 border border-neutral-600/30">
            <span className="font-mono text-xs text-neutral-200 break-all flex-1">
              {contractAddress}
            </span>
            <CopyButton text={contractAddress} />
          </div>
        </div>

        {/* Token Information */}
        {tokenLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        ) : tokenData ? (
          <div className="space-y-3">
            {/* Token Name & Symbol */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">
                  Name
                </span>
                <p className="text-xs text-neutral-200 font-medium truncate">
                  {tokenData.name || "Unknown"}
                </p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block mb-1">
                  Symbol
                </span>
                <span className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded text-xs font-mono border border-purple-500/30">
                  {tokenData.symbol || "N/A"}
                </span>
              </div>
            </div>

            {/* Supply & Holders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">
                  Total Supply
                </span>
                <p className="text-xs text-neutral-200 font-mono">
                  {formatSupply(tokenData.total_supply, tokenData.decimals)}
                </p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block mb-1">
                  Holders
                </span>
                <p className="text-xs text-neutral-200 font-medium">
                  {formatNumber(tokenData.holders_count || tokenData.holders)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-neutral-400 text-xs">
              Token information unavailable
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-neutral-700/50 space-y-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30 rounded hover:from-blue-600/30 hover:to-blue-700/30 transition-all duration-200 text-xs font-medium group"
          >
            <Globe className="w-3 h-3 mr-1.5 group-hover:scale-110 transition-transform" />
            View on Explorer
            <ExternalLink className="w-2.5 h-2.5 ml-1.5 opacity-60" />
          </a>

          <a
            href={`https://dexscreener.com/base/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-400 border border-green-500/30 rounded hover:from-green-600/30 hover:to-green-700/30 transition-all duration-200 text-xs font-medium group"
          >
            <svg
              className="w-3 h-3 mr-1.5 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            DexScreener
            <ExternalLink className="w-2.5 h-2.5 ml-1.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
