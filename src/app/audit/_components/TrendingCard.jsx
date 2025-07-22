'use client';
import { Card } from "@/components/Card";

const popularTokens = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    chain: "ethereum",
    volume: "$2.1B",
    price: "$67,234.45",
    change: "+2.34%",
    trending: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    chain: "ethereum",
    volume: "$1.8B",
    price: "$3,245.67",
    change: "+1.87%",
    trending: true,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    chain: "ethereum",
    volume: "$987M",
    price: "$1.00",
    change: "+0.01%",
    trending: false,
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
    chain: "ethereum",
    volume: "$567M",
    price: "$612.34",
    change: "+3.12%",
    trending: true,
  },
];

export const TrendingCard = () => {
  return (
    <Card title="Market Trending">
      <div className="space-y-3">
        {popularTokens.map((token, index) => (
          <div
            key={index}
            className="group flex items-center justify-between p-4 bg-neutral-800/30 hover:bg-neutral-800/50 rounded-lg cursor-pointer transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600/50"
            onClick={() => handleTokenClick(token)}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-neutral-200 mb-1">
                {token.name}
              </div>
              <div className="text-sm text-neutral-400 font-mono truncate">
                {token.address}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              {token.trending && (
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              )}
              <svg
                className="w-4 h-4 text-neutral-500 group-hover:text-neutral-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}

        {/* <div className="text-center pt-6 border-t border-neutral-700/50 mt-6">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-2 mx-auto">
            <span>Explore Market Analysis</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div> */}
      </div>
    </Card>
  );
};

export default TrendingCard;
