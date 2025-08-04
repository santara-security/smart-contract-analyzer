import dotenv from "dotenv";
import { streamText, generateText } from "ai";
import { z } from "zod";
import { ChutesClient } from "@/lib/chutes";

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
    if (
      useTools &&
      (content.toLowerCase().includes("analyz") ||
        content.toLowerCase().includes("contract"))
    ) {
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

      const toolResult = await chutesClient.simulateToolExecution("analyzeContract", {
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
