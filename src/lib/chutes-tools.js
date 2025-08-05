import { zodSchema } from "@ai-sdk/provider-utils";
import { z } from "zod";
import { spawn } from "child_process";
import path from "path";

/**
 * Chutes AI Tools Library
 * Provides tools that can be passed to the AI similar to "ai" or "@ai-sdk/openai"
 */

/**
 * Tool for vector search in crawled data
 */
// export const vectorizeSearch = tool({
//   description: 'This tool performs a vector search on the vulnerability smart contract data.',
//   name: 'vectorizeSearch',
//   // inputSchema: zodSchema(
//   //   z.object({
//   //     query: z.string().describe('The search query. you can use keyword for vulnerability or smart contract function'),
//   //     top_k: z.number().min(1).max(10).optional().default(3)
//   //       .describe('Number of top results to return')
//   //   })
//   // ),
//   inputSchema: z.object({
//     query: z.string().describe('The search query. You can use keywords for vulnerability or smart contract function'),
//     top_k: z.number().min(1).max(10).optional().default(3)
//       .describe('Number of top results to return')
//   }),
//   execute: async ({ query, top_k }) => {
//     console.log(`Executing vector search with query: ${query}, top_k: ${top_k}`);
//     // Execute vector search tool by calling Python script
//     try {
//       // Create a promise to handle the Python script execution
//       const vectorToolResult = await new Promise((resolve, reject) => {
//         const pythonPath = 'python';
//         const scriptPath = path.join(process.cwd(), 'python/vectorize.py');
//         const scriptArgs = [
//           '../crawl_result',
//           '--search', query,
//           '--json',
//           '--top-k', top_k || 3
//         ];
//         console.log(`Executing Python script: ${pythonPath} ${scriptPath} ${scriptArgs.join(' ')}`);

//         const pythonProcess = spawn(pythonPath, [scriptPath, ...scriptArgs], {
//           cwd: path.join(process.cwd(), 'python')
//         });

//         let stdoutData = '';
//         let stderrData = '';

//         pythonProcess.stdout.on('data', (data) => {
//           stdoutData += data.toString();
//         });

//         pythonProcess.stderr.on('data', (data) => {
//           stderrData += data.toString();
//         });

//         pythonProcess.on('close', (code) => {
//           if (code === 0) {
//             try {
//               const result = JSON.parse(stdoutData);
//               console.log('Vector search result:', result);
//               resolve(result);
//             } catch (parseError) {
//               reject(new Error(`Failed to parse JSON output: ${parseError.message}`));
//             }
//           } else {
//             reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
//           }
//         });

//         pythonProcess.on('error', (error) => {
//           reject(new Error(`Failed to start Python process: ${error.message}`));
//         });
//       });

//       return vectorToolResult;
//     } catch (error) {
//       console.error("Vector search error:", error);
//       // Fallback to simulated result if Python execution fails
//       return {
//         results: []
//       };
//     }
//   }
// });

export const vectorSearch = {
  name: "vector_search",
  description:
    "This tool performs a vector search on the vulnerability smart contract data.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "The search query. You can use keywords for vulnerability or smart contract function"
      ),
    top_k: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .default(3)
      .describe("Number of top results to return"),
  }),
  execute: async ({ query, top_k }) => {
    console.log(
      `Executing vector search with query: ${query}, top_k: ${top_k}`
    );
    // Execute vector search tool by calling Python script
    try {
      // Create a promise to handle the Python script execution
      const vectorToolResult = await new Promise((resolve, reject) => {
        const pythonPath = "python";
        const scriptPath = path.join(process.cwd(), "python/vectorize.py");
        const scriptArgs = [
          "../crawl_result",
          "--search",
          query,
          "--json",
          "--top-k",
          top_k || 3,
        ];
        console.log(
          `Executing Python script: ${pythonPath} ${scriptPath} ${scriptArgs.join(
            " "
          )}`
        );

        const pythonProcess = spawn(pythonPath, [scriptPath, ...scriptArgs], {
          cwd: path.join(process.cwd(), "python"),
        });

        let stdoutData = "";
        let stderrData = "";

        pythonProcess.stdout.on("data", (data) => {
          stdoutData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          stderrData += data.toString();
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            try {
              const result = JSON.parse(stdoutData);
              console.log("Vector search result:", result);
              resolve(result);
            } catch (parseError) {
              reject(
                new Error(`Failed to parse JSON output: ${parseError.message}`)
              );
            }
          } else {
            reject(
              new Error(`Python script exited with code ${code}: ${stderrData}`)
            );
          }
        });

        pythonProcess.on("error", (error) => {
          reject(new Error(`Failed to start Python process: ${error.message}`));
        });
      });

      return vectorToolResult;
    } catch (error) {
      console.error("Vector search error:", error);
      // Fallback to simulated result if Python execution fails
      return {
        results: [],
      };
    }
  },
};

export const getKak = {
  name: "get_kak",
  description: "Get KAK (Kerangka Acuan Kerja) for a project",
  parameters: z.object({
    projectId: z.string().describe("The ID of the project to get KAK"),
  }),
  execute: async (args) => {
    // await delayAndLog("get_kak");
    try {
      const { projectId } = args;

      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
      });

      if (!project) {
        logger.error(`Project with ID ${projectId} not found`);
        throw new Error(`Project with ID ${projectId} not found`);
      }
      let str = `Kerangka Acuan Kerja (KAK)

                -----

                **Latar Belakang:**
                ${project.latar_belakang}

                -----

                **Tujuan:**
                ${project.tujuan}

                -----

                **Sasaran:**
                ${project.sasaran}
                `;
      return str;
    } catch (error) {
      logger.error("Error fetching project or KAK:", error);
      throw new Error(`Failed to fetch project: ${error.message}`);
    }
  },
};
