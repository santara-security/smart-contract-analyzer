import { NextResponse } from "next/server";
import chains from "@/lib/chains.json";
import fetchContract from "@/lib/utils/downloadContract";

const defaultChain = chains.chains.filter((chain) => chain.name === "base");

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

  console.log(selectedChain);
  const result = await fetchContract(tokenAddress, selectedChain);

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json({
    tokenAddress,
    chain,
    filePath: result.filePath,
    analysis: `Contract code saved to ${result.filePath}`,
  });
}
