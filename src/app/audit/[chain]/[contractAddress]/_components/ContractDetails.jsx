"use client";
import React from "react";
import { useTokenInfo } from "../_hooks";
import chains from "@/lib/chains";
import { formatNumber, formatSupply } from "@/lib/formatting";

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
      className="ml-2 p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
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
    <div className="bg-neutral-800/30 rounded-lg p-3">
      <h3 className="text-base font-semibold text-neutral-200 mb-3">
        Contract Details
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contract Information */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Blockchain Network
            </label>
            <div className="flex items-center">
              <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs border border-blue-500/30">
                {chainDisplayName}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Contract Address
            </label>
            <div className="flex items-center bg-neutral-700/30 rounded p-2">
              <span className="font-mono text-xs text-neutral-200 break-all flex-1">
                {contractAddress}
              </span>
              <CopyButton text={contractAddress} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors text-xs font-medium"
            >
              <svg
                className="w-3 h-3 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
              Explorer
            </a>

            <a
              href={`https://dexscreener.com/base/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-500/30 rounded hover:bg-green-600/30 transition-colors text-xs font-medium"
            >
              DexScreener
            </a>
          </div>
        </div>

        {/* Token Information */}
        <div className="space-y-3">
          {tokenLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          ) : tokenData ? (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Token Name
                </label>
                <p className="text-xs text-neutral-200 truncate">
                  {tokenData.name || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Symbol
                </label>
                <div className="flex items-center">
                  <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/30 font-mono">
                    {tokenData.symbol || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Total Supply
                </label>
                <p className="text-xs text-neutral-200 font-mono">
                  {formatSupply(tokenData.total_supply, tokenData.decimals)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Holders
                </label>
                <p className="text-xs text-neutral-200">
                  {formatNumber(tokenData.holders_count || tokenData.holders)}
                </p>
              </div>

              {tokenData.exchange_rate && (
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Price
                  </label>
                  <p className="text-xs text-neutral-200">
                    ${tokenData.exchange_rate}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-neutral-400 text-xs">Token info unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
