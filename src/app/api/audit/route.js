import { NextResponse } from "next/server";
import chains from "@/lib/chains.json";
import fetchContract from "@/lib/utils/downloadContract";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const defaultChain = chains.chains.filter((chain) => chain.name === "base");

// Helper function to run Slither analysis
async function runSlitherAnalysis(chain, tokenAddress) {
  const outputPath = `./results/${chain}/${tokenAddress}/analysis.json`;
  const outputDir = path.dirname(path.join(process.cwd(), outputPath));

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  const slitherCommand = `slither ${chain}:${tokenAddress} --etherscan-apikey NCUY8QN5NU14K513XD4D6KN6DCU63B6NAR --json ${outputPath}`;

  try {
    console.log(`Running Slither analysis: ${slitherCommand}`);
    const { stdout, stderr } = await execAsync(slitherCommand, {
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large outputs
    });

    if (stderr && !stderr.includes("INFO")) {
      console.warn("Slither stderr:", stderr);
    }

    if (stdout) {
      console.log("Slither stdout:", stdout.substring(0, 200) + "...");
    }

    // Verify the output file was created and has content
    const outputExists = await checkFileExists(
      `results/${chain}/${tokenAddress}/analysis.json`
    );
    if (!outputExists) {
      throw new Error(
        "Slither analysis completed but no output file was generated"
      );
    }

    console.log("Slither analysis completed successfully");
    return true;
  } catch (error) {
    console.error("Slither analysis failed:", error);

    // If timeout, provide more specific error
    if (error.killed && error.signal === "SIGTERM") {
      throw new Error("Slither analysis timed out after 5 minutes");
    }

    const oE = await checkFileExists(
      `results/${chain}/${tokenAddress}/analysis.json`
    );
    if (oE) {
      return NextResponse.json({
        tokenAddress,
        chain,
        filePath: `results/${chain}/${tokenAddress}/analysis.json`,
        result: oE,
      });
    }

    throw new Error(`Slither analysis failed: ${error.message}`);
  }
}

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
    try {
      console.log(
        `Analysis file not found for ${chain}:${tokenAddress}. Running Slither analysis...`
      );
      await runSlitherAnalysis(chain, tokenAddress);
      console.log("Slither analysis completed, proceeding to read results...");
    } catch (error) {
      console.error("Failed to run Slither analysis:", error);
      return NextResponse.json(
        { error: `Failed to run security analysis` },
        { status: 500 }
      );
    }
  }

  try {
    const fileContents = await readFile(filePath);

    // Verify that the analysis contains valid results
    if (!fileContents || !fileContents) {
      setTimeout(async () => {
        const fc = await readFile(filePath);
        if (!fc) {
          throw new Error("Analysis file is empty or corrupted");
        }
      }, 2000);
    }

    console.log(`Successfully read analysis for ${chain}:${tokenAddress}`);
    return NextResponse.json({
      tokenAddress,
      chain,
      filePath,
      result: fileContents,
    });
  } catch (error) {
    console.error("Failed to read analysis file:", error);
    const fe = await checkFileExists(filePath);
    if (fe) {
      return NextResponse.json({
        tokenAddress,
        chain,
        filePath,
        result: fe,
      });
    }
    return NextResponse.json(
      { error: `Failed to read analysis file: ${error.message}` },
      { status: 500 }
    );
  }
}
