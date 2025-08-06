import { NextResponse } from "next/server";
import chains from "@/lib/chains";
import { setCache, getCache } from "@/lib/cache";
// Cache helpers
const fs = require("fs");
const path = require("path");

const defaultChain = chains.filter((chain) => chain.name === "base");

// Blockscout API endpoints for different chains
const getBlockscoutApiUrl = (chain) => {
  const endpoints = {
    base: "https://base.blockscout.com/api/v2",
    ethereum: "https://eth.blockscout.com/api/v2",
    polygon: "https://polygon.blockscout.com/api/v2",
    arbitrum: "https://arbitrum.blockscout.com/api/v2",
    optimism: "https://optimism.blockscout.com/api/v2",
    bsc: "https://api.bscscan.com/api",
  };

  return endpoints[chain] || endpoints["base"];
};

export const getTokenWithBlockscout = async ({
  tokenAddress,
  chain,
  successCallback = () => {},
  errorCallback = () => {},
}) => {
  const cacheDir = path.join(process.cwd(), "results", "token");
  const cacheKey = `${tokenAddress}_${chain}`;
  const cached = getCache(cacheDir, cacheKey, 900000);

  if (cached) {
    return successCallback(cached);
  }

  const baseUrl = getBlockscoutApiUrl(chain);
  const apiUrl = `${baseUrl}/tokens/${tokenAddress}`;


  const response = await fetch(apiUrl, {
    headers: {
      accept: "application/json",
    },
    // Add timeout
    signal: AbortSignal.timeout(10000), // 10 seconds timeout
  });

  if (!response.ok) {
    if (response.status === 404) {
      return errorCallback(new Error("Token not found"));
    }

    throw new Error(
      `Blockscout API returned ${response.status}: ${response.statusText}. 
      Please check ${apiUrl} for more details.`
    );
  }

  setCache(cacheDir, cacheKey, response, 900000); // Cache for 15 minutes
  const tokenData = await response.json();
  return successCallback(tokenData);
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get("tokenAddress");
  const chain = searchParams.get("chain") ?? defaultChain[0]?.name;

  if (!tokenAddress) {
    return NextResponse.json(
      { error: "tokenAddress is required" },
      { status: 400 }
    );
  }

  const selectedChain = chains.find((c) => c.name === chain);

  if (!selectedChain) {
    return NextResponse.json(
      { error: "Invalid chain specified" },
      { status: 400 }
    );
  }

  try {
    return await getTokenWithBlockscout({
      tokenAddress,
      chain,
      successCallback: (data) => {
        return NextResponse.json(data);
      },
      errorCallback: (error) => {
        return NextResponse.json(
          { error: `Failed to fetch token information: ${error.message}` },
          { status: 500 }
        );
      },
    });
  } catch (error) {
    console.error("Error fetching token info:", error);
    return NextResponse.json(
      { error: `Failed to fetch token information: ${error.message}` },
      { status: 500 }
    );
  }

}
