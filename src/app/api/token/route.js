import { NextResponse } from "next/server";
import chains from "@/lib/chains.json";
import { setCache, getCache } from "@/lib/cache";
// Cache helpers
const fs = require("fs");
const path = require("path");

const defaultChain = chains.chains.filter((chain) => chain.name === "base");

// Blockscout API endpoints for different chains
const getBlockscoutApiUrl = (chain) => {
  const endpoints = {
    base: "https://base.blockscout.com/api/v2",
    ethereum: "https://eth.blockscout.com/api/v2",
    polygon: "https://polygon.blockscout.com/api/v2",
    arbitrum: "https://arbitrum.blockscout.com/api/v2",
    optimism: "https://optimism.blockscout.com/api/v2",
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
  // 15 minutes cache = 15 * 60 * 1000 = 900000 ms
  const cached = getCache(cacheDir, cacheKey, 900000);

  if (cached) {
    return successCallback(cached);
  }

  const baseUrl = getBlockscoutApiUrl(chain);
  const apiUrl = `${baseUrl}/tokens/${tokenAddress}`;

  console.log(`Fetching token info from: ${apiUrl}`);

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
      `Blockscout API returned ${response.status}: ${response.statusText}`
    );
  }

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

  const selectedChain = chains.chains.find((c) => c.name === chain);

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

  try {
    const result = {
      tokenAddress,
      chain,
      data: tokenData,
    };

    // Cache the successful result
    setCache(cacheDir, cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch token info:", error);

    if (error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timed out while fetching token information" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch token information: ${error.message}` },
      { status: 500 }
    );
  }
}
