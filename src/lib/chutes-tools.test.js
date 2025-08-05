import { exec } from "child_process";
import { vectorSearch, vectorReadFile } from "./chutes-tools.js";
import { readFile } from "fs/promises";

/**
 * Test file demonstrating usage of the Chutes tools
 */

async function testVectorizeSearch() {
  console.log("Testing vectorizeSearch tool with ChutesClient...\n");
  try {
    const searchResults = await vectorSearch.execute({
      query: "reentrancy guard",
      top_k: 2,
    });

    return searchResults;
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run the test
const res = await testVectorizeSearch();

if (res) {
  let result_path = res.results?.[0]?.file_path;
  console.log("Result file path:", result_path);
  let f = vectorReadFile.execute({ file: result_path });
  console.log("File content:", f);
}
