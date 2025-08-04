const { Server } = require('@modelcontextprotocol/server');
const { PythonShell } = require('python-shell');

// Create MCP server
const server = new Server({
  name: "Vectorize MCP Server",
  version: "1.0.0"
});

// Tool definition for vectorize search
server.on("get_tools", () => {
  return [
    {
      name: "vectorize_search",
      description: "Search for relevant information in crawled documents using vector similarity",
      input_schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find relevant information"
          },
          top_k: {
            type: "number",
            description: "Number of top results to return (default: 5)",
            default: 5
          }
        },
        required: ["query"]
      }
    }
  ];
});

// Tool execution handler
server.on("call_tool", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "vectorize_search") {
    try {
      // Prepare Python script options
      const options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: '../../python',
        args: [
          '../crawl_result',
          '--search', args.query,
          '--json',
          '--top-k', args.top_k || 5
        ]
      };

      // Execute Python script
      const results = await new Promise((resolve, reject) => {
        PythonShell.run('vectorize.py', options, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      // Parse the JSON output from the Python script
      const output = results.join('\n');
      const jsonData = JSON.parse(output);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(jsonData, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing vectorize search: ${error.message}`
          }
        ]
      };
    }
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${name}`
      }
    ]
  };
});

// Start the server
server.listen();
console.log("Vectorize MCP Server started");
