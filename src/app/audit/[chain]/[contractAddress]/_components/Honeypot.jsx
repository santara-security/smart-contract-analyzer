"use client";

const example_honeypotPairs = [
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-WETH",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x4200000000000000000000000000000000000006",
      ],
      Address: "0xe31c372a7af875b3b5e0f3713b17ef51556da667",
    },
    Reserves: [2.2421019643129255e24, 1.2233631226896075e21],
    Liquidity: 7264382.527083611,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1729527427,
    CreationTxHash:
      "0x054bebd19c6928dc2f097a110f877b625bf7262088506539147c1a49c165a80e",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-GAME",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x1c4cca7c5db003824208adda61bd749e55f463a3",
      ],
      Address: "0xd418dfe7670c21f682e041f34250c114db5d7789",
    },
    Reserves: [3.0344708379648896e24, 1.0194346092307643e26],
    Liquidity: 9831685.515006242,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1727091731,
    CreationTxHash:
      "0x48d275dab49804b2fbf68019bd34415af3623db0373cf70be2554725653e2497",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-LUNA",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x55cd6469f597452b5a7536e2cd98fde4c1247ee4",
      ],
      Address: "0xa8e64fb120ce8796594670bae72279c8aa1e5359",
    },
    Reserves: [1.3522027372627876e24, 1.3262589335056991e26],
    Liquidity: 4381136.868731432,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1729083587,
    CreationTxHash:
      "0xba3fc80f09240d085117e656d7704f9e501bb5b47a3df2752250e5cb60dd0b4b",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-AIXBT",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825",
      ],
      Address: "0x7464850cc1cfb54a2223229b77b1bca2f888d946",
    },
    Reserves: [1.0965322137231236e24, 1.2014823762826698e25],
    Liquidity: 3552764.3724629213,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1730525195,
    CreationTxHash:
      "0x934b067300d1a3e568697970d1a425dfffc60d9d6232fe88e77831c6b7b3cb45",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-CONVO",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0xab964f7b7b6391bd6c4e8512ef00d01f255d9c0d",
      ],
      Address: "0x3268d7efa254e648ffe968664e47ca226e27cd04",
    },
    Reserves: [8.915450268228548e23, 3.278365339068514e26],
    Liquidity: 2888605.88690605,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1727766735,
    CreationTxHash:
      "0x935fca757db610902150f63fded61ee06e8c4995c612790415b389fe120358a1",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-TIBBIR",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0xa4a2e2ca3fbfe21aed83471d28b6f65a233c6e00",
      ],
      Address: "0x0c3b466104545efa096b8f944c1e524e1d0d4888",
    },
    Reserves: [6.985976874884162e23, 1.6115605544046528e25],
    Liquidity: 2263456.5074624685,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1736641803,
    CreationTxHash:
      "0x6a56599bb11f22a1de165dd4a9887724188098527b230fb8e018d6bb3474f71e",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V3: VIRTUAL-WETH",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x4200000000000000000000000000000000000006",
      ],
      Address: "0x9c087eb773291e50cf6c6a90ef0f4500e349b903",
    },
    Reserves: [9.689844039324446e23, 90097799435269230000],
    Liquidity: 1837256.001871869,
    Router: "0x2626664c2603336e57b271c5c0b26f421741e481",
    CreatedAtTimestamp: 1730195457,
    CreationTxHash:
      "0xf75f333d2b529ba9bf83fbd2d51295a3cafcc8a2cb3fc31e944db395512821ae",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-AIDOG",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x80394ae69f14444605032a7f2d74c8ab7d16a51d",
      ],
      Address: "0xdaae8afdeb4d31e4f6a0cdb9d490d4188d48c0a9",
    },
    Reserves: [5.553024196628708e23, 6.770117100176003e25],
    Liquidity: 1799179.8397077015,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1739614567,
    CreationTxHash:
      "0x17e43560962242fb03d52b4d23944a3dc62e0cd3ce80e0a7beb20d5e29559156",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V3: VIRTUAL-USDC",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      ],
      Address: "0x529d2863a1521d0b57db028168fde2e97120017c",
    },
    Reserves: [7.441791072498691e23, 561759188357],
    Liquidity: 1767247.325260288,
    Router: "0x2626664c2603336e57b271c5c0b26f421741e481",
    CreatedAtTimestamp: 1712965679,
    CreationTxHash:
      "0x540ccc0840b94ed95f79d12388f0d537da872d7b64a83068546ddf804330c1aa",
  },
  {
    ChainID: 8453,
    Pair: {
      Name: "Uniswap V2: VIRTUAL-VADER",
      Tokens: [
        "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
        "0x731814e491571a2e9ee3c5b1f7f3b962ee8f4870",
      ],
      Address: "0xa1dddb82501e8fe2d92ad0e8ba331313f501de72",
    },
    Reserves: [4.935088383240154e23, 3.0597079404893337e25],
    Liquidity: 1598968.6361698098,
    Router: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    CreatedAtTimestamp: 1730489361,
    CreationTxHash:
      "0x032afdd16b4dbcc5553f9f97c60a429384d55d2a3e539d59dc16958f040b4df2",
  },
];

const example_honeyPot = [
  {
    token: {
      name: "Virtual Protocol",
      symbol: "VIRTUAL",
      decimals: 18,
      address: "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
      totalHolders: 881877,
      airdropSummary: {
        totalTxs: 11536,
        totalAmountWei: "66033773942140538215956670",
        totalTransfers: 1146865,
      },
    },
    withToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x4200000000000000000000000000000000000006",
      totalHolders: 3481906,
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
      holders: "2879",
      successful: "2879",
      failed: "0",
      siphoned: "0",
      averageTax: 0,
      averageGas: 101877.4275790205,
      highestTax: 0,
      highTaxWallets: "0",
      taxDistribution: [
        {
          tax: 0,
          count: 2879,
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
      reserves0: "2242101964312925526211739",
      reserves1: "1223363122689607465360",
      liquidity: 7264382.527083611,
      router: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
      createdAtTimestamp: "1729527427",
      creationTxHash:
        "0x054bebd19c6928dc2f097a110f877b625bf7262088506539147c1a49c165a80e",
    },
    pairAddress: "0xe31c372a7af875b3b5e0f3713b17ef51556da667",
  },
];

import React, { useState } from "react";

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
      {risk || `Risk Level ${riskLevel || 0}`}
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
      {isHoneypot ? "Honeypot" : "Safe"}
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

const formatTax = (tax) => {
  if (!tax || tax === 0) return "0";
  // Round up to nearest whole number if close to whole number
  const numTax = parseFloat(tax);
  if (numTax > 0.999 && numTax < 1.001) return "1";
  if (numTax > 1.999 && numTax < 2.001) return "2";
  if (numTax > 2.999 && numTax < 3.001) return "3";
  // For other cases, round to 2 decimal places
  return numTax.toFixed(2);
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
              <RiskBadge
                risk={honeypotResult.summary?.risk}
                riskLevel={honeypotResult.summary?.riskLevel}
              />
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

          {honeypotResult && (
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
          )}
        </div>
      )}
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
