"use client";
import React from "react";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

export const ContractDetails = ({ chain, contractAddress }) => {
  const getExplorerUrl = (chain, address) => {
    const explorers = {
      'base': 'https://basescan.org/address',
      'ethereum': 'https://etherscan.io/address',
      'polygon': 'https://polygonscan.com/address',
      'arbitrum': 'https://arbiscan.io/address',
      'optimism': 'https://optimistic.etherscan.io/address',
    };
    
    const baseUrl = explorers[chain] || explorers['base'];
    return `${baseUrl}/${address}`;
  };

  const getChainDisplayName = (chain) => {
    const chainNames = {
      'base': 'Base',
      'ethereum': 'Ethereum',
      'polygon': 'Polygon',
      'arbitrum': 'Arbitrum',
      'optimism': 'Optimism',
    };
    
    return chainNames[chain] || chain.charAt(0).toUpperCase() + chain.slice(1);
  };

  const explorerUrl = getExplorerUrl(chain, contractAddress);
  const chainDisplayName = getChainDisplayName(chain);

  return (
    <div className="bg-neutral-800/30 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-neutral-200 mb-4">
        Contract Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Blockchain Network
          </label>
          <div className="flex items-center">
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">
              {chainDisplayName}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Contract Address
          </label>
          <div className="flex items-center bg-neutral-700/30 rounded p-2">
            <span className="font-mono text-sm text-neutral-200 break-all flex-1">
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
            className="flex items-center justify-center px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg>
            View on Explorer
          </a>
        </div>

      </div>
    </div>
  );
};
