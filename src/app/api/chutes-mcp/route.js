import dotenv from "dotenv";
import { streamText, generateText } from "ai";
import { z } from "zod";
import { ChutesClient } from "@/lib/chutes";
import { analyzeContract } from "./tools/contractAnalyzer";
import { vectorizeSearch } from "./tools/vectorSearch";

dotenv.config();

// Initialize Chutes client
const chutesClient = new ChutesClient();

export async function POST(req) {
  try {
    const {
      messages,
      stream = false,
      maxTokens = 1024,
      temperature = 0.7,
      useTools = false,
      toolChoice = "auto",
    } = await req.json();

    if (!process.env.CHUTES_API_TOKEN) {
      throw new Error("CHUTES_API_TOKEN is not configured");
    }

    // Prepare the request to Chutes AI
    let systemMessage = "";
    if (useTools) {
      systemMessage =
        "You are a smart contract analysis assistant. You can analyze smart contracts and fetch blockchain data. When asked to analyze contracts or get blockchain data, indicate that you would use the appropriate tools.";
    }

    const apiMessages = systemMessage
      ? [{ role: "system", content: systemMessage }, ...messages]
      : messages;

    // Use the ChutesClient library for the API call
    const result = await chutesClient.chatCompletion({
      messages: apiMessages,
      model: "zai-org/GLM-4.5-Air",
      stream: false,
      maxTokens,
      temperature,
      useTools,
      toolChoice,
    });

    let content = result.content;
    let toolCalls = [];
    let toolResults = [];

    // Simulate tool usage based on content analysis
    if (useTools) {
      // Check for contract analysis requests
      if (content.toLowerCase().includes("analyz") || content.toLowerCase().includes("contract")) {
        toolCalls.push({
          id: "call_1",
          type: "function",
          function: {
            name: "analyzeContract",
            arguments: JSON.stringify({
              contractCode: "simulated",
              analysisType: "security",
            }),
          },
        });

        const toolResult = await analyzeContract({
          contractCode: "simulated",
          analysisType: "security",
        });

        toolResults.push({
          toolCallId: "call_1",
          result: toolResult,
        });

        content += `\n\n**Tool Analysis Results:**\n${JSON.stringify(
          toolResult,
          null,
          2
        )}`;
      }

      // Check for vector search requests
      if (content.toLowerCase().includes("search") || content.toLowerCase().includes("find") || content.toLowerCase().includes("backdoor") || content.toLowerCase().includes("vulnerability")) {
        // Extract search query from content (simplified approach)
        const searchMatch = content.match(/(?:search for|find|looking for|check for)\s+(.+?)(?:\?|\.|$)/i);
        const query = searchMatch ? searchMatch[1] : content;
        
        toolCalls.push({
          id: "call_2",
          type: "function",
          function: {
            name: "vectorize_search",
            arguments: JSON.stringify({
              query: query,
              top_k: 3
            }),
          },
        });

        // Execute vector search tool by calling Python script
        try {
          const vectorToolResult = await vectorizeSearch({
            query: query,
            top_k: 3
          });

          toolResults.push({
            toolCallId: "call_2",
            result: vectorToolResult,
          });

          content += `\n\n**Vector Search Results:**\n${JSON.stringify(
            vectorToolResult,
            null,
            2
          )}`;
        } catch (error) {
          console.error("Vector search error:", error);
          // Fallback to simulated result if Python execution fails
          const vectorToolResult = {
            results: []
          };

          toolResults.push({
            toolCallId: "call_2",
            result: vectorToolResult,
          });

          content += `\n\n**Vector Search Results (Simulated due to error):**\n${JSON.stringify(
            vectorToolResult,
            null,
            2
          )}`;
        }
      }
    }

    return new Response(
      JSON.stringify({
        content,
        usage: result.usage,
        model: "zai-org/GLM-4.5-Air",
        finishReason: result.finishReason,
        toolCalls,
        toolResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Chutes AI MCP API error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const healthStatus = await chutesClient.healthCheck();
    return new Response(
      JSON.stringify(healthStatus),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
