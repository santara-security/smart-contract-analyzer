/**
 * Next.js App Router API route to fetch all supported chains from OKX DEX
 * and cache the successful response "forever".
 *
 * Environment variables required:
 * - OKX_API_KEY
 * - OKX_SECRET_KEY
 * - OKX_PASSPHRASE
 * - OKX_PROJECT_ID
 *
 * Dependency: @okx-dex/okx-dex-sdk
 *
 * This handler:
 * - Initializes OKX SDK client with provided credentials
 * - Fetches supported chain data (via DexAPI.getChainData for known chains) once
 * - On first successful fetch, caches it in-memory and always serves from cache afterwards
 * - If fetch fails and cache exists, serves stale cache
 * - If fetch fails and no cache, returns 502 with error details
 */

import { NextResponse } from "next/server";
import { getClient } from "@/lib/okx/OkxClient";

// Force runtime to be Node.js to support SDK/network usage reliably
export const runtime = "nodejs";

// This route is static after first successful fetch since we serve from our own cache.
// Next.js won't revalidate, and we'll rely purely on our in-memory cache logic here.
export const dynamic = "force-static";

/**
 * Simple in-memory cache for this process. Note: in serverless environments with multiple instances,
 * each instance maintains its own cache. For true global persistence, move to a shared store.
 */
let cachedChains = null;
let cachedAtMs = null;
let lastError = null;

/**
 * Attempt to fetch supported chains from OKX DEX.
 * Depending on the SDK, available methods may vary. Commonly, DEX SDKs expose a method
 * like getSupportedChains or listChains. We try a few conventional names and fall back to a generic request.
 */
async function fetchSupportedChains() {
  const client = getClient();

  // SDK 1.0.16 exposes DexAPI methods on client.dex but not a single "getSupportedChains".
  // We will derive supported chain list by probing known EVM chain IDs via client.dex.getChainData.
  // Adjust this list as needed to include all OKX-supported chains.
  const candidateChainIds = [
    // Common EVM chains (chainId in decimal strings as expected by SDK)
    "1",        // Ethereum
    "10",       // Optimism
    "25",       // Cronos
    "56",       // BSC
    "100",      // Gnosis
    "128",      // HECO
    "137",      // Polygon
    "250",      // Fantom
    "324",      // zkSync
    "1101",     // Polygon zkEVM
    "42161",    // Arbitrum
    "43114",    // Avalanche
    "8453",     // Base
    "59144",    // Linea
    "81457",    // Blast
    "167000",   // Taiko
    "534352",   // Scroll
    "56",       // BSC (duplicate-safe)
  ];

  const results = [];
  for (const id of candidateChainIds) {
    try {
      if (client?.dex?.getChainData) {
        const resp = await client.dex.getChainData(id);
        // Normalize APIResponse<{...}> shape
        const data = resp?.data ?? resp?.result ?? resp;
        if (data) {
          results.push({
            chainId: id,
            data,
          });
        }
      }
    } catch {
      // Ignore chains not supported by OKX DEX or failures; continue probing others.
    }
  }

  if (results.length === 0) {
    throw new Error("No chains resolved via OKXDexClient.dex.getChainData(). Update candidate list or SDK.");
  }

  // Return a simple list of chainIds with their metadata
  return results;
}

export async function GET() {
  // If we already have a cached successful response, serve it immediately.
  if (cachedChains) {
    return NextResponse.json(
      {
        ok: true,
        cached: true,
        cachedAt: cachedAtMs,
        chains: cachedChains,
      },
      {
        status: 200,
        headers: {
          // Instruct Next.js/edge/CDNs to treat as immutable (no revalidation).
          // Cache-control here is mostly for outer caches; our in-memory cache serves instantly.
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  }

  // Otherwise, attempt to fetch and cache.
  try {
    const data = await fetchSupportedChains();

    // Data is an array of { chainId, data } from SDK calls
    const chains = Array.isArray(data) ? data : [];
    if (!chains || chains.length === 0) {
      throw new Error("Empty supported chains response from OKX DEX (SDK probing)");
    }

    cachedChains = chains;
    cachedAtMs = Date.now();
    lastError = null;

    return NextResponse.json(
      {
        ok: true,
        cached: false,
        cachedAt: cachedAtMs,
        chains: cachedChains,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (err) {
    // If we have stale cache, serve it to be resilient.
    if (cachedChains) {
      return NextResponse.json(
        {
          ok: true,
          cached: true,
          cachedAt: cachedAtMs,
          warning: "Upstream fetch failed; serving cached data",
          lastError: String(err?.message || err),
          chains: cachedChains,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        }
      );
    }

    lastError = String(err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to fetch supported chains from OKX DEX",
        detail: lastError,
      },
      { status: 502 }
    );
  }
}
