import { NextResponse } from "next/server";
import chains from "@/lib/chains";
import { setCache, getCache } from "@/lib/cache";

const defaultChain = chains.filter((chain) => chain.name === "base")?.[0];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("tokenAddress");
  const pair = searchParams.get("pair");
  const chain = searchParams.get("chain")
    ? chains.find((c) => c.name == searchParams.get("chain"))?.id
    : defaultChain?.id;

  if (!address || !pair) {
    return NextResponse.json(
      { error: "Missing address or pair" },
      { status: 400 }
    );
  }

  const fs = require("fs");
  const path = require("path");
  const { execSync } = require("child_process");

  // Cache helpers
  const cacheDir = path.join(
    process.cwd(),
    "results",
    "honeypot",
    "is_honey_pot"
  );
  const cacheKey = `${chain.name}_${address}_${pair}_${chain}`;
  const cached = getCache(cacheDir, cacheKey);

  if (cached) {
    return NextResponse.json(cached);
  }

  let result = {};
  try {
    // Use bash.exe compatible command
    const pyPath = path.join(process.cwd(), "python", "is_honey_pot.py");
    const pythonCmd = process.env.PYTHON_COMMAND || "python3";
    const cmd = `${pythonCmd} "${pyPath}" "${address}" "${pair}" "${chain}"`;
    console.log("Running command:", cmd);
    const output = execSync(cmd, { encoding: "utf8" });
    result = JSON.parse(output);

    console.log("Python script output:", result);
    if (result && result.hasOwnProperty("error")) {
      console.log("has error");
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    setCache(cacheDir, cacheKey, result);
  } catch (err) {
    result = { error: "Failed to run python script", details: err.message };
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
