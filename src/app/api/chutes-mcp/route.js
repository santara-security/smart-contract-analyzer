import dotenv from "dotenv";
import { generateText } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { vectorReadFile, vectorSearch } from "@/lib/chutes-tools";

const chutesProvider = createOpenAI({
  name: "chutes",
  apiKey: process.env.CHUTES_API_TOKEN,
  baseURL: "https://llm.chutes.ai/v1",
});

// const model = chutesProvider("moonshotai/Kimi-K2-Instruct");
const model = chutesProvider("deepseek-ai/DeepSeek-V3-0324");

dotenv.config();

// Initialize Chutes client
const conversationHistories = new Map();

export async function POST(req) {
  console.log(model);

  try {
    const { conversationId, prompt, messages } = await req.json();

    // Get or initialize conversation history
    let conversationHistory = [];
    if (conversationId) {
      conversationHistory = conversationHistories.get(conversationId) || [];
    }

    // const systemPrompt = `You are a smart contract analysis assistant named "Santara AI".
    // You are designed to help users understand vulnerabilities in smart contracts and provide insights on how to mitigate them.

    // Rules:
    // 1. Always Analyze Smart Contract based on the provided messages.
    // 2. Use the tools provided to answer questions about vulnerabilities and smart contract functions.
    // 3. Be honest and concise in your responses. If you don't know the answer, say "I don't know".
    // 4. If you need to use a tool, provide a clear explanation of why it's necessary.
    
    // Tools Usage:
    // - Use the \`vectorSearch\` tool to search for specific vulnerabilities or smart contract functions. ALWAYS use 1 word to search, example: "reentrancy", "overflow", "transfer".
    // - Use the \`vectorReadFile\` tool to read specific files from the vector database when necessary.
    // - Always return the relevant information to the user after using a tool.
    // `;

    const systemPrompt = `You are a smart contract analysis assistant named "Santara AI". Your purpose is to act as an expert-level smart contract auditor. You will analyze Solidity code provided by the user to identify vulnerabilities, suggest gas optimizations, recommend security best practices, and provide a clear explanation of the contract's functionality.

## Core Analysis Workflow
When the user provides a smart contract, you must follow these steps in order:
1.  **Initial Review & Explanation:** Begin by performing a high-level review of the code. Provide a concise, easy-to-understand summary of what the contract does, who can interact with it, and its primary purpose.
2.  **Comprehensive Audit:** Conduct a deep analysis of the code, focusing on the four key pillars:
    * **Vulnerability Analysis:** Identify potential security risks (e.g., reentrancy, integer overflow/underflow, access control issues, etc.). For each finding, explain the risk and assign a severity level (Critical, High, Medium, Low).
    * **Gas Optimization:** Identify areas in the code where gas usage can be reduced. Suggest specific code changes and explain why they are more efficient.
    * **Best Practices:** Check the code against common Solidity development standards and best practices (e.g., using specific Solidity versions, proper event emissions, code layout, NatSpec comments).
    * **Logic and Functionality:** Explain the core functions and logic flows of the contract.
3.  **Tool-Assisted Enhancement:** After your initial analysis, use the provided tools to search for detailed information on the specific vulnerabilities or concepts you've identified. This helps you provide more detailed, authoritative mitigation advice.
4.  **Synthesize and Report:** Combine your analysis and tool findings into a single, structured report using the format defined below.


## Tool Usage
- Use the 'vectorSearch' tool to find detailed information on vulnerabilities or optimization techniques you've already identified in your analysis.
- **IMPORTANT:** Use concise, descriptive phrases (1-2 words) for your search queries to get the best results.
- **GOOD Example:** 'vectorSearch(query="reentrancy")'

## Rules
1.  Analyze the smart contract code provided by the user.
2.  Follow the Core Analysis Workflow and Output Structure precisely.
3.  Be honest and objective. If the code is well-written, acknowledge it. If you don't find any issues in a certain category, state that clearly.

## Final Response
- Include this disclaimer at the end of every analysis: "This analysis is performed by an AI and is for educational purposes only. It is not a substitute for a professional security audit. Always have your contracts professionally audited before deployment."
`;

    // Build the messages array properly
    let apiMessages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
    ];

    // Track user messages for conversation history
    const newUserMessages = [];

    // Add the new user message(s)
    if (messages) {
      if (typeof messages === "string") {
        const userMsg = { role: "user", content: messages };
        apiMessages.push(userMsg);
        newUserMessages.push(userMsg);
      } else if (Array.isArray(messages) && messages.length > 0) {
        // If conversation history is empty, add all messages from the array
        // If conversation history exists, only add new user messages that aren't already in history
        if (conversationHistory.length === 0) {
          // Fresh conversation - add all messages
          messages.forEach((message) => {
            if (message.role && message.content) {
              const msg = { role: message.role, content: message.content };
              apiMessages.push(msg);
              if (message.role === "user") {
                newUserMessages.push(msg);
              }
            }
          });
        } else {
          // Existing conversation - only add the last user message to avoid duplication
          const lastMessage = messages[messages.length - 1];
          if (
            lastMessage &&
            lastMessage.role === "user" &&
            lastMessage.content
          ) {
            const userMsg = { role: "user", content: lastMessage.content };
            apiMessages.push(userMsg);
            newUserMessages.push(userMsg);
          }
        }
      } else if (typeof messages === "object" && messages.content) {
        const role = messages.role || "user";
        const userMsg = { role: role, content: messages.content };
        apiMessages.push(userMsg);
        if (role === "user") {
          newUserMessages.push(userMsg);
        }
      }
    } else if (prompt) {
      const userMsg = { role: "user", content: prompt };
      apiMessages.push(userMsg);
      newUserMessages.push(userMsg);
    }

    console.log("Conversation ID:", conversationId);
    console.log("Conversation history length:", conversationHistory.length);
    console.log(
      "Input messages array length:",
      Array.isArray(messages) ? messages.length : 0
    );
    console.log("New user messages to add:", newUserMessages.length);
    console.log(
      "Sending messages to API:",
      JSON.stringify(apiMessages, null, 2)
    );

    // OpenAI text generation using Vercel AI SDK
    const aiResult = await generateText({
      model: model,
      messages: apiMessages,
      tools: {
        vectorSearch: vectorSearch,
        vectorReadFile: vectorReadFile,
      },
      toolChoice: "auto", // Automatically choose the best tool
      schema: z.object({
        text: z.string().describe("The AI's response text"),
      }),
      mode: "json",
      stream: true,
      maxSteps: 15,
    });

    console.log("AI result:", aiResult);
    const { text, toolCalls, toolResults } = aiResult;

    // Update conversation history
    if (conversationId) {
      // Add new user messages to conversation history
      newUserMessages.forEach((msg) => {
        conversationHistory.push(msg);
      });

      // Add the assistant response
      if (text) {
        conversationHistory.push({ role: "assistant", content: text });
      }

      // Store updated conversation history
      conversationHistories.set(conversationId, conversationHistory);
    }

    return new Response(
      JSON.stringify({
        text,
        toolCalls,
        toolResults,
        conversationHistory: conversationHistory,
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
    // Simple health check - just verify the model is accessible
    const { text } = await generateText({
      model: model,
      messages: [{ role: "user", content: "Hello" }],
    });

    return new Response(
      JSON.stringify({ status: "healthy", message: "API is working" }),
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
