import { spawn } from 'child_process';
import path from 'path';

export async function vectorizeSearch(args) {
  // Execute vector search tool by calling Python script
  try {
    // Create a promise to handle the Python script execution
    const vectorToolResult = await new Promise((resolve, reject) => {
      const pythonPath = 'python';
      const scriptPath = path.join(process.cwd(), 'python/vectorize.py');
      const scriptArgs = [
        '../crawl_result',
        '--search', args.query,
        '--json',
        '--top-k', args.top_k || 3
      ];
      console.log(`Executing: ${pythonPath} ${scriptPath} ${scriptArgs.join(' ')}`);
      
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
      results: [
      ]
    };
  }
}
