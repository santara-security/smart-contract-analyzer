import { tool, zodSchema } from '@ai-sdk/provider-utils';
import { z } from 'zod';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Chutes AI Tools Library
 * Provides tools that can be passed to the AI similar to "ai" or "@ai-sdk/openai"
 */

/**
 * Tool for vector search in crawled data
 */
export const vectorizeSearch = tool({
  description: 'This tool performs a vector search on the vulnerability smart contract data.',
  name: 'vectorizeSearch',
  inputSchema: zodSchema(
    z.object({
      query: z.string().describe('The search query. you can use keyword for vulnerability or smart contract function'),
      top_k: z.number().min(1).max(10).optional().default(3)
        .describe('Number of top results to return')
    })
  ),
  execute: async ({ query, top_k }) => {
    console.log(`Executing vector search with query: ${query}, top_k: ${top_k}`);
    // Execute vector search tool by calling Python script
    try {
      // Create a promise to handle the Python script execution
      const vectorToolResult = await new Promise((resolve, reject) => {
        const pythonPath = 'python';
        const scriptPath = path.join(process.cwd(), 'python/vectorize.py');
        const scriptArgs = [
          '../crawl_result',
          '--search', query,
          '--json',
          '--top-k', top_k || 3
        ];
        console.log(`Executing Python script: ${pythonPath} ${scriptPath} ${scriptArgs.join(' ')}`);
        
        const pythonProcess = spawn(pythonPath, [scriptPath, ...scriptArgs], {
          cwd: path.join(process.cwd(), 'python')
        });
        
        let stdoutData = '';
        let stderrData = '';
        
        pythonProcess.stdout.on('data', (data) => {
          stdoutData += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          stderrData += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(stdoutData);
              console.log('Vector search result:', result);
              resolve(result);
            } catch (parseError) {
              reject(new Error(`Failed to parse JSON output: ${parseError.message}`));
            }
          } else {
            reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
          }
        });
        
        pythonProcess.on('error', (error) => {
          reject(new Error(`Failed to start Python process: ${error.message}`));
        });
      });

      return vectorToolResult;
    } catch (error) {
      console.error("Vector search error:", error);
      // Fallback to simulated result if Python execution fails
      return {
        results: []
      };
    }
  }
});
