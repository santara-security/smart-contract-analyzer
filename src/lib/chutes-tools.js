import { zodSchema } from "ai";
import { z } from "zod";
import { readFile } from "fs/promises";
import { searchTopKByWord } from "./rag/search.js";

export const vectorSearch = {
  name: "vector_search",
  description:
    "This tool performs a vector search on the vulnerability smart contract data.",
  parameters: z.object({
    keyword: z
      .string()
      .describe(
        "The search keyword. use only 1 word to search, example: 'reentrancy', 'overflow', 'ether transfer'"
      ),
    top_k: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .default(5)
      .describe("Number of top results to return. maximum 10. Default is 5 "),
  }),
  execute: async ({ keyword, top_k }) => {
    console.log(
      `Executing vector search with keyword: ${keyword}, top_k: ${top_k}`
    );
    try {
      // Use the searchTopKByWord function from rag/search.js
      const results = await searchTopKByWord(keyword, top_k);
      // Return results as expected by the tool interface
      return {
        results: results.map(({ id, filePath, fileName, title, source, crawledAt, createdAt, updatedAt, value }) => ({
          id,
          filePath,
          fileName,
          title,
          source,
          crawledAt,
          createdAt,
          updatedAt,
          value,
        })),
      };
    } catch (error) {
      console.error("Vector search error:", error);
      // Fallback to simulated result if Python execution fails
      return {
        results: [],
      };
    }
  },
};

export const vectorReadFile = {
  name: "vector_read_file",
  description:
    "This tool reads a file from the vector database and returns its content.this result did not shown to user, after use this provide the relevant answer to user from this result",
  parameters: z.object({
    file: z.string().describe("The file path to read from the vector database"),
  }),
  execute: async ({ file }) => {
    console.log(`Reading file from vector database: ${file}`);
    let result_path = file;
    // Normalize Windows absolute path to POSIX for Node.js if needed
    if (result_path.startsWith("..\\")) {
      result_path = result_path.substring(3);
      result_path = './' + result_path;
    }
    // If absolute Windows path, use as-is (Node.js can handle it)
    // But for safety, replace backslashes with forward slashes for cross-platform
    if (result_path.match(/^[A-Za-z]:\\/)) {
      result_path = result_path.replace(/\\/g, "/");
    }
    try {
      const data = await readFile(result_path, "utf8");
      console.log("File content:", data);
      return data;
    } catch (err) {
      console.error("Error reading file:", err.message);
      return null;
    }
  },
};
