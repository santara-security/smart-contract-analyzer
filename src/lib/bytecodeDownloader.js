import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function downloadByteCode(tokenAddress, chainInfo) {
  try {
    const response = await fetch(chainInfo.httpRpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getCode",
        params: [tokenAddress, "latest"],
        id: 1,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return { status: "error", message: data.error.message };
    }

    const contractCode = data.result;

    if (contractCode === "0x") {
      return {
        status: "error",
        message: "No contract code found at this address",
      };
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    const fileName = `${tokenAddress}.txt`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, contractCode);

    return { status: "success", filePath: `/uploads/${fileName}` };
  } catch (error) {
    return { status: "error", message: "Failed to fetch contract code" };
  }
}
