import { NextResponse } from "next/server";
import chains from "@/lib/chains.json";
import fetchContract from "@/lib/utils/downloadContract";
import { promises as fs } from "fs";
import path from "path";

const defaultChain = chains.chains.filter((chain) => chain.name === "base");

// Helper function to check if file exists
async function checkFileExists(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.access(fullPath);
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to read file contents
async function readFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

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

  //check if the file exists on results\base\0xB600CE2781e5018B922CA471C19562799cb96EAD\analysis.json
  const filePath = `results/${chain}/${tokenAddress}/analysis.json`;
  const fileExists = await checkFileExists(filePath);

  if (!fileExists) {
    return NextResponse.json(
      { error: "Analysis file not found" },
      { status: 404 }
    );
  }

  try {
    const fileContents = await readFile(filePath);
    return NextResponse.json({
      tokenAddress,
      chain,
      filePath,
      result: fileContents,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to read analysis file: ${error.message}` },
      { status: 500 }
    );
  }
}
