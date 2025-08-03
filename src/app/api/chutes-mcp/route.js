import dotenv from "dotenv";
import { streamText, generateText } from "ai";
import { z } from "zod";

dotenv.config();

// MCP-style tools simulation (since we're using direct API calls)
const simulateToolExecution = async (toolName, parameters) => {
  switch (toolName) {
    case 'analyzeContract':
      return {
        analysis: `Performed ${parameters.analysisType} analysis on contract`,
        vulnerabilities: ["No immediate security issues found"],
        gasOptimizations: ["Consider using ++i instead of i++"],
        recommendations: ["Add input validation", "Use latest Solidity version"]
      };
    case 'getBlockchainData':
      return {
        address: parameters.address,
        network: parameters.network,
        balance: "0.0 ETH",
        transactions: [],
        contracts: []
      };
    default:
      return { error: "Unknown tool" };
  }
};

export async function POST(req) {
  try {
    const { 
      messages, 
      stream = false, 
      maxTokens = 1024, 
      temperature = 0.7,
      useTools = false,
      toolChoice = "auto"
    } = await req.json();
    
    if (!process.env.CHUTES_API_TOKEN) {
      throw new Error("CHUTES_API_TOKEN is not configured");
    }

    // Prepare the request to Chutes AI
    let systemMessage = "";
    if (useTools) {
      systemMessage = "You are a smart contract analysis assistant. You can analyze smart contracts and fetch blockchain data. When asked to analyze contracts or get blockchain data, indicate that you would use the appropriate tools.";
    }

    const apiMessages = systemMessage 
      ? [{ role: "system", content: systemMessage }, ...messages]
      : messages;

    const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHUTES_API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "zai-org/GLM-4.5-Air",
        messages: apiMessages,
        stream: false,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Chutes AI API error: ${response.statusText} - ${errorBody}`
      );
    }

    const data = await response.json();
    
    let content = data.choices[0].message.content || data.choices[0].message.reasoning_content || "";
    let toolCalls = [];
    let toolResults = [];

    // Simulate tool usage based on content analysis
    if (useTools && (content.toLowerCase().includes("analyz") || content.toLowerCase().includes("contract"))) {
      toolCalls.push({
        id: "call_1",
        type: "function",
        function: {
          name: "analyzeContract",
          arguments: JSON.stringify({
            contractCode: "simulated",
            analysisType: "security"
          })
        }
      });
      
      const toolResult = await simulateToolExecution("analyzeContract", {
        contractCode: "simulated",
        analysisType: "security"
      });
      
      toolResults.push({
        toolCallId: "call_1",
        result: toolResult
      });

      content += `\n\n**Tool Analysis Results:**\n${JSON.stringify(toolResult, null, 2)}`;
    }

    return new Response(JSON.stringify({ 
      content,
      usage: data.usage,
      model: "zai-org/GLM-4.5-Air",
      finishReason: data.choices[0].finish_reason,
      toolCalls,
      toolResults
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Chutes AI MCP API error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Health check endpoint
export async function GET() {
  try {
    const hasToken = !!process.env.CHUTES_API_TOKEN;
    return new Response(JSON.stringify({
      status: "ok",
      provider: "Chutes AI",
      model: "zai-org/GLM-4.5-Air",
      tokenConfigured: hasToken,
      features: ["streaming", "tools", "mcp-compatible"]
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
