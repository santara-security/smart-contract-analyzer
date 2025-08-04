const { spawn } = require('child_process');
const path = require('path');

// Test the vectorize search tool
async function testVectorizeSearch() {
  try {
    console.log("Testing vectorize search tool...");
    
    // Create a promise to handle the Python script execution
    const vectorToolResult = await new Promise((resolve, reject) => {
      const pythonPath = 'python';
      const scriptPath = path.join(__dirname, 'python/vectorize.py');
      const args = [
        '../crawl_result',
        '--search', `implement timestamp based checkpoints (and voting).
     */
    function clock() external view returns (uint48);

    /**
     * @dev Description of the clock
     */
    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() external view returns (string memory);
}
`,
        '--json',
        '--top-k', '5'
      ];
      
      console.log(`Executing: ${pythonPath} ${scriptPath} ${args.join(' ')}`);
      
      const pythonProcess = spawn(pythonPath, [scriptPath, ...args], {
        cwd: path.join(__dirname, 'python')
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
            reject(new Error(`Failed to parse JSON output: ${parseError.message}\nOutput: ${stdoutData}`));
          }
        } else {
          reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
        }
      });
      
      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });

    console.log("Vector search results:", JSON.stringify(vectorToolResult, null, 2));
  } catch (error) {
    console.error("Vector search error:", error);
  }
}

// Run the test
testVectorizeSearch();
