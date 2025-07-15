import { NextResponse } from "next/server";
import chains from "@/lib/chains.json";
import { setCache, getCache } from "@/lib/cache";

const defaultChain = chains.chains.filter((chain) => chain.name === "base")[0];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("tokenAddress");
  const chain = searchParams.get("chain") ?? defaultChain?.id;

  if (!address) {
    return NextResponse.json(
      { error: "Missing address" },
      { status: 400 }
    );
  }

  const fs = require("fs");
  const path = require("path");
  const { execSync } = require("child_process");

  // Cache helpers
  const cacheDir = path.join(process.cwd(), "results", "honeypot", "top_holders");
  const cacheKey = `${address}_${chain}`;
  const cached = getCache(cacheDir, cacheKey);

  if (cached) {
    return NextResponse.json(cached);
  }

  let result = {};
  try {
    // Use bash.exe compatible command
    const pyPath = path.join(process.cwd(), "python", "top_holders.py");
    const pythonCmd = process.env.PYTHON_COMMAND || "python3";
    const cmd = `${pythonCmd} "${pyPath}" "${address}" "${chain}"`;
    const output = execSync(cmd, { encoding: "utf8" });
    result = JSON.parse(output);
    setCache(cacheDir, cacheKey, result);
  } catch (err) {
    result = { error: "Failed to run python script", details: err.message };
  }

  return NextResponse.json(result);
}
