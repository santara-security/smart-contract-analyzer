"use client";
import React from "react";
import { useTokenInfo } from "../_hooks";

const formatNumber = (num) => {
  if (!num) return "N/A";
  return new Intl.NumberFormat().format(num);
};

const formatSupply = (supply, decimals) => {
  if (!supply || !decimals) return "N/A";
  const divisor = Math.pow(10, parseInt(decimals));
  const formatted = (BigInt(supply) / BigInt(divisor)).toString();
  return formatNumber(formatted);
};

const TokenInfo = ({ chain, contractAddress }) => {
  const { tokenData, loading, error, retry } = useTokenInfo(
    chain,
    contractAddress
  );

  if (loading) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Token Information
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Token Information
        </h3>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-red-300 text-sm mb-2">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="bg-neutral-800/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4">
          Token Information
        </h3>
        <div className="text-center py-8">
          <p className="text-neutral-400 text-sm">No token data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-neutral-200 mb-6">
        Token Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-neutral-300 border-b border-neutral-700 pb-2">
            Basic Information
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Name
              </label>
              <p className="text-neutral-200">{tokenData.name || "N/A"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Symbol
              </label>
              <p className="text-neutral-200 font-mono">
                {tokenData.symbol || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Type
              </label>
              <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm border border-blue-500/30">
                {tokenData.type || "Unknown"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Decimals
              </label>
              <p className="text-neutral-200">{tokenData.decimals || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Supply & Holders */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-neutral-300 border-b border-neutral-700 pb-2">
            Supply & Holders
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Total Supply
              </label>
              <p className="text-neutral-200 font-mono text-sm">
                {formatSupply(tokenData.total_supply, tokenData.decimals)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">
                Holders
              </label>
              <p className="text-neutral-200">
                {formatNumber(tokenData.holders_count || tokenData.holders)}
              </p>
            </div>

            {tokenData.circulating_market_cap && (
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Market Cap
                </label>
                <p className="text-neutral-200">
                  ${formatNumber(tokenData.circulating_market_cap)}
                </p>
              </div>
            )}

            {tokenData.exchange_rate && (
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  Price
                </label>
                <p className="text-neutral-200">${tokenData.exchange_rate}</p>
              </div>
            )}

            {tokenData.volume_24h && (
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">
                  24h Volume
                </label>
                <p className="text-neutral-200">
                  ${formatNumber(tokenData.volume_24h)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="mt-6 pt-4 border-t border-neutral-700">
        <div className="text-xs text-neutral-500">
          <p>
            Data provided by{" "}
            <a
              href={`https://${chain}.blockscout.com/token/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Blockscout
            </a>
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TokenInfo;
