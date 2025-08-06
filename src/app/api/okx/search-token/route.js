/**
 * Next.js API route: Search token by name or address on Ethereum, BNB, and Base using OKX DEX SDK.
 *
 * GET /api/okx/search-token?q=...&type=name|address
 * - q: token name substring or full token address (0x...)
 * - type (optional): "name" or "address" (auto-detect if omitted)
 *
 * Response shape:
 * {
 *   ok: boolean,
 *   query: string,
 *   type: "name" | "address",
 *   results: Array<{
 *     chainId: string,
 *     chainName: string,
 *     tokenAddress: string,
 *     symbol: string,
 *     name: string,
 *     decimals: number
 *   }>
 * }
 *
 * Only searches on:
 * - Ethereum (1)
 * - BNB (56)
 * - Base (8453)
 *
 * Uses OKXDexClient.dex.getTokens(chainId) and filters by name/symbol for name searches.
 * For address searches, attempts to match exact address within the token list for the chain.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/okx/OkxClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Changed from force-static to force-dynamic

const SUPPORTED = [
  { id: "1", name: "Ethereum" },
  { id: "56", name: "BNB" },
  { id: "8453", name: "Base" },
];


function isAddressLike(q) {
  return typeof q === "string" && /^0x[a-fA-F0-9]{40}$/.test(q.trim());
}

function normalizeTokensFromAggregator(chainId, chainName, respBody) {
  // OKX Aggregator all-tokens returns { code, msg, data: Array<{ tokenName, tokenSymbol, tokenContractAddress, decimals, ... }>}
  const data = respBody?.data ?? [];
  if (!Array.isArray(data)) return [];
  return data.map((t) => ({
    chainId,
    chainName,
    tokenAddress: t?.tokenContractAddress || "",
    symbol: t?.tokenSymbol || "",
    name: t?.tokenName || "",
    decimals: typeof t?.decimals === "number" ? t.decimals : Number(t?.decimals ?? 0),
    raw: t,
  }));
}

export async function GET(request) {
  try {
    // Ensure API key is present for OKX Aggregator (prevents 401)
    const apiKey = process.env.OKX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing OKX_API_KEY. Set it in your environment (.env or hosting provider).",
        },
        { status: 500 }
      );
    }

    // Fix: Properly access search parameters from NextRequest
    const { searchParams } = new URL(request.url);
    
    console.log("Search request URL:", request.url);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    const q = (searchParams.get("q") || "").trim();
    const explicitType = (searchParams.get("type") || "").toLowerCase();
    
    if (!q) {
      return NextResponse.json(
        { ok: false, error: "Missing query parameter 'q'." },
        { status: 400 }
      );
    }

    const type =
      explicitType === "name" || explicitType === "address"
        ? explicitType
        : isAddressLike(q)
        ? "address"
        : "name";

    // Use authenticated OKX SDK client instead of unauthenticated REST calls
    const results = [];
    const client = getClient();

    await client.httpClient.request();

    console.log(client.httpClient.request);
    console.log(typeof client.httpClient.request);
    // console.log(client.httpClient.request);


    return NextResponse.json(
      {
        ok: true,
        query: q,
        type,
        results: [client.httpClient],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60", // short cache for search
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to search tokens",
        detail: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
